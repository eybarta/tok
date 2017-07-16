import store from '/imports/vuex'

import { FixedTests } from '/imports/api/collections/fixedtests'
import { Questions } from '/imports/api/collections/questions'
import { Images } from '/imports/api/collections/images'
// import QuestionList from '/imports/api/supply/questions-resource'
import { questionGenerator } from '/imports/api/generators/questionGenerator'

import { categories } from '/imports/api/categories'

// TEST MENU
export const updateTestMenu = ({commit}, data) => {
    console.log('update test menu>> ', data);
    commit('UPDATE_TESTMENU', data)
}

// ACTIVE TEST
export const saveTestToUser = ({ commit, state}, testinfo) => {
    console.log("1 SAVE TEST >> ", testinfo);
    return new Promise((resolve, reject) => {
        Meteor.call('user.savetest', testinfo, result => {
            console.log("2 SAVED TEST..", result);
            resolve();
        })
    });
}

export const initFixedTests = ({ commit }) => {
    console.log("initFixedTests>>>>>>>>>>>>>>>>>>>>");
    Tracker.autorun((c) => {
        let fixedtestsSub = Meteor.subscribe('fixedtests');
        let fixedtests = FixedTests.find({}).fetch();
        console.log('[ACTIONS:FixedTests] fixedtests sub.. ', fixedtestsSub, " :: ", fixedtests);
        if (!!fixedtestsSub.ready()) {
            console.log("fixedtestsSub ready");
            commit('INIT_FIXED_TESTS', fixedtests)
            c.stop();
        }
    })
}

export const saveFixedTestToDB = async ({ commit, state, dispatch}, testdata) => {
    console.log("save test to db >> ", testdata);
    return new Promise((resolve, reject) => {
        Meteor.call('fixedtest.save', testdata, result => {
            console.log("test saved..", result);
            let message = "המבחן נשמר בהצלחה.";
            let type = "success";
            let data = { message, type, timer:3000, active:true}
            
            dispatch('globalStore/setNote', data, {root:true})
            resolve(true);
        })
    });
}

export const removeFixedTest = ({commit,state,dispatch}, testdata) => {
    console.log("remove test from db >> ", testdata);
    return new Promise((resolve, reject) => {
        Meteor.call('fixedtest.remove', testdata, result => {
            console.log("test saved..", result);
            if (!!result) {
                let message = "המבחן נמחק בהצלחה.";
                let type = "success";
                let data = { message, type, timer:3000, active:true}
                
                dispatch('globalStore/setNote', data, {root:true})
                resolve(true);
            }
            
        })
    });
}

// QUESTION BANK :: ADMIN
export const initQuestions = ({ commit }) => {
    Tracker.autorun((c) => {
        let questionsSub = Meteor.subscribe('questions');
        let questions = Questions.find({}).fetch();
        if (questionsSub.ready()) {
            console.log("QUESTIONS >>> ", questions);
            commit('INIT_QUESTIONS', questions)
            c.stop();
        }
    })
}
export const saveQuestion = ({commit, state}, questiondata) => {
    console.log('save question to db >>', questiondata);
    return new Promise((resolve, reject) => {
        Meteor.call('questions.save', questiondata, result => {
            console.log("return from method call>> ", result);
            resolve();
            if (typeof result === 'undefined') {
                return true;
            } else {
                return 'error'
            }
        })
    });
}

export const initImagesCollection = ({commit}) => {
    Tracker.autorun((c) => {
        Meteor.subscribe('images');
        let images = Images.find({}).fetch();
        // console.log("IMAGES >> ", images);
        if (!!images) {
            commit('INIT_IMAGES_COLLECTION', images)
            console.log("IMAGES >> ", images);
            c.stop();
        }
    })   
}

async function fetchQuestionList(category = null) {
    return new Promise((resolve, reject) => {
        Tracker.autorun((c) => {
            Meteor.subscribe('questions', category);
            let questionlist = Questions.find({}).fetch();
            console.log("questionlist >> ", questionlist)
            if (!!questionlist.length) {
                resolve(questionlist[0].questions);
                c.stop();
            }
        })
    });
}
export const fetchTestQuestions = async ({commit, state, dispatch, rootState}) => {
        console.log('fetchTestQuestions');
            let routename = rootState.route.name;
            let params = rootState.route.params;
            let questions;
            let questionslist = null;
            if (params.category!='series') {
                questionslist = await fetchQuestionList(params.category)
                console.log("222QUESTIONLIST > ", questionslist, questionslist.length);
                if (!questionslist || !questionslist.length) {
                    console.log("STOP!!!!!!!!!!!!");
                    return;
                }
            }
            console.log("CONTINUE!!!!!!! >> ", params.name, " :: ", routename);
                    
            if (!!params.name || !isNaN(params.name)) {
                if (routename==='testhistory') {
                    console.log("store > ", store);
                    let usertests = store.getters['usersModule/userCurrentCategoryTestHistory'];
                    console.log('usertests >> ', usertests);
                    if (!!usertests) {
                        if (!isNaN(params.name)) {
                            commit('UPDATE_TEST_QUESTIONS', usertests[params.name].questions);

                        }
                        else {
                            let test = _.find(usertests, obj => obj.label===params.name)
                            commit('UPDATE_TEST_QUESTIONS', test.questions);
                        }
                    }
                }    
                else if (routename==='fixedtest') {
                    let questions = fetchFixedTest(rootState.route.params, questionslist, state.fixedtests);
                    console.log('fixed q.. ', questions);
                    // return questions;
                    commit('UPDATE_TEST_QUESTIONS', _.flatten(questions));
                }
                // else {
                //     let category = this.activeCategory;
                //     let subcategory = _.find(category.children, { value: params.name});
                //     let questions = questionGenerator(category.value, subcategory.value, subcategory.label, 20);
                //     return questions;
                // }
            }
            else if (/test/gi.test(routename)) {
                if (routename==='autotest') {
                    questions = fetchAutoTest(rootState.route.params, questionslist);

                    // return fetchAutoTest();
                }
                else if (routename==='adaptivetest') {
                    console.log("(params.adaptivetest) QUESTIONS GETTER >> params ", params);
                    
                    questions = fetchAdaptivetest(rootState.route.params, questionslist);
                }
                
                console.log("return questions  >", questions);
                
                commit('UPDATE_TEST_QUESTIONS', _.flatten(questions));
                // return _.shuffle(_.flatten(questions));
            }
            // }
           
        }
const fetchFixedTest  = (params, questionlist, fixedtests) =>  {
        console.log('in fetchFixedTest >> ', fixedtests);
        let type = params.category;
        let name = params.name;
            console.log('in fetchFixedTest, type >> ', type);
            console.log('in fetchFixedTest, name >> ', name);
            let fixedTestByCategory = _.find(fixedtests, {type});
            console.log('in fetchFixedTest, fixedTestByCategory >> ', fixedTestByCategory);
            
            if (!!fixedTestByCategory) {
                let test = _.find(fixedTestByCategory.tests, { name});
                return test.questions;
            }
}
const fetchAutoTest = (params, questionlist) =>  {
            let type = params.category;
            let questions = [];
            let category = _.find(categories, { value: type});
            let children = category.children;
            if (!!questionlist && !!questionlist.length && questionlist.length>0) {
                // let questionlist = this.questionList[0].questions;
                console.log("1 IN FETCH AUTO >> ", questionlist);
                
                let questionListByCategory = _.groupBy(questionlist, 'type.value');

                console.log('1 questionListByCategory >> ', questionListByCategory);
                for (var cat in questionListByCategory) {
                    questionListByCategory[cat] = _.shuffle(questionListByCategory[cat])
                    if (cat=="comprehension") {
                        questionListByCategory[cat] = _.filter(questionListByCategory[cat], { imageUrl:questionListByCategory[cat][0].imageUrl })
                    }
                    /*
                        Transform questionListByCategory question arrays into
                        index arrays.
                    */
                    questionListByCategory[cat] = 
                        _.map(questionListByCategory[cat], 
                            question => {
                                for (var i = 0; i<questionlist.length;i++) {
                                    let q = questionlist[i];
                                    //    console.log("for >> ", q.question, " :: ", question);
                                
                                    if (q.question===question.question) {
                                        return i;
                                    }
                                }
                                return -1
                            }
                        )
                }
                let categoryArray = _.flattenDeep(_.map(questionListByCategory, (a,b,c) => {
                    return Object.keys( a );
                }))
                var count = 0;
                var amount = 28; // temp
                // while(count<20) {

                    /*
                        Take 5 from each category in order
                    */
                    for (var i in questionListByCategory) {
                        let questionArray = questionListByCategory[i];
                        console.log('questionArray >> ', questionArray)
                        for (var j = 0; j < questionArray.length; j++) {
                            let index = questionArray[j];
                            // console.log("index >> ", index);
                            let question = _.clone(questionlist[index]);
                            let answers = {
                                list: question.answers,
                                correct: question.answers[0]
                            }
                            question.answers = answers;
                            question.chosenAnswer = null;
                            if(questions.length<amount) {

                                questions.push(question)
                                count++;
                            }
                                
                        }
                    }
            }
            else {
                console.log("AUTO TEST QUESTIONS > SERIES??!?!!?");
                _.each(children, child => {
                    questions.push(
                        ...questionGenerator(type, child.value, child.label, 1)
                    ) 
                })
                while(questions.length<20) {
                    let child = children[_.random(0, children.length)];
                    if (!!child && !!child.value) {
                        questions.push(
                            ...questionGenerator(type, child.value, child.label, 1)
                        ) 
                    }
                }
            }
            console.log("AUTO TEST QUESTIONS > ", questions);
            return questions;
        }

 /*
                Get test statistics from user and create
                Adaptive test..
                Question Amount by correctly answered:
                >90% -- 0
                >=75% -- 5
                >=50% -- 5
                >=25% -- 5
                >=0 -- 5 
*/

const fetchAdaptivetest = (params, questionlist) => {
    console.log('generateAdaptivetest >> ', params);
    
    if (!!user.profile.tests) {
        let tests = _.filter(user.profile.tests, test => {return /test/g.test(test.type)});
        console.log("tests user has taken > ", tests);
        /*
            Now.. for every test
            - Filter out only the answered questions
            - Map out { type / correct|wrong }
            
            -- Map all tests to { type: x, correct: y, wrong: z }
        */
        let allAnsweredQuestions = _.filter(_.flatMap(tests, 'questions'), 'chosenAnswer');
        let mappedAnswersByType = _(allAnsweredQuestions)
            .groupBy('type')
            .map((v, k) => ({ 
                type: k,
                total: _.sumBy(allAnsweredQuestions, {type:k}),
                correct: _.sumBy(v, function(obj) { return Number(obj.chosenAnswer===obj.answers.correct)}),
                get percent() {
                    return Math.round(this.correct/this.total*100);
                }
            })).value();
        /*
            Group by percent correctly answered
        */
        let mappedAnswersByCorrect = _.groupBy(mappedAnswersByType, function(obj){ 
            switch(true) {
                case(obj.percent>=90):
                    return '90';
                case(obj.percent>=75):
                    return '75';
                case(obj.percent>=50):
                    return '50';
                case(obj.percent>=25):
                    return '25';
                default:
                    return '0'
            }
        })
        console.log('mappedAnswersByCorrect >> ', mappedAnswersByCorrect);
        /*
            Build the adaptive test
        */         
        let questions = [];
        let category = _.find(categories, { value: params.category});
        let children = category.children;
        let p = mappedAnswersByCorrect;
        let breakpoints = [75,50,25,0];
        while (questions.length<20) {
            for (var i = 0; i < breakpoints.length; i++) {
                let bp = breakpoints[i];
                if (_.has(p, bp) && p[bp].length>0) {
                    console.log(">>>>> ", p[bp] );
                    console.log("children >>>> ", children );
                    let types = _.map(p[bp], 'type');

                    let testTypesByLevel = _.sortBy(_.filter(children, obj => {
                        return types.indexOf(obj.value)>-1
                    }), 'level');
                    console.log('testTypesByLevel>> ', testTypesByLevel);

                    for (var j = 0; j<testTypesByLevel.length; j++) {
                        let type = testTypesByLevel[j];
                        let amount = Math.min(5, 20-questions.length);
                        console.log("type to generate=== ", params.category, type.value, amount);
                        questions.push(...questionGenerator(params.category, type.value, type.label, amount))
                    }
                }
            }
        }
        console.log("final adpative questions>> ", questions);
        return questions;

    }
}