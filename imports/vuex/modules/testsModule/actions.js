import { FixedTests } from '/imports/api/collections/fixedtests'
import { Questions } from '/imports/api/collections/questions'
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
    return new Promise((resolve, reject) => {
        Meteor.call('user.savetest', testinfo, result => {
            resolve();
        })
    });
}

export const initFixedTests = ({ commit }) => {
    Tracker.autorun((c) => {
        Meteor.subscribe('fixedtests');
        let fixedtests = FixedTests.find({}).fetch();
        if (!!fixedtests) {
            commit('INIT_FIXED_TESTS', fixedtests)
            stop();
        }
    })
}

export const saveFixedTestToDB = ({ commit, state}, testdata) => {
    console.log("save test to db >> ", testdata);
    return new Promise((resolve, reject) => {
        Meteor.call('fixedtest.save', testdata, result => {
            resolve();
        })
    });
}

// QUESTION BANK :: ADMIN
export const initQuestions = ({ commit }) => {
    // Tracker.autorun((c) => {
    //     Meteor.subscribe('questions');
    //     let questions = Questions.find({}).fetch();
    //     if (!!questions) {
    //         commit('INIT_QUESTIONS', questions)
    //         stop();
    //     }
    // })
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
// export const updateQuestionIndex = ({commit, state, getters}, to) => {
//     let index = state.questionIndex,
//         questionsAmount = getters.questions.length-1
//     if (to=='next') {
//         index != questionsAmount ? index++ : index=0
//     }
//     else if (to=='prev') {
//         index != 0 ? index-- : index=questionsAmount
//     }
//     else {
//         index = to;
//     }
//     commit('UPDATE_QUESTION_INDEX', index)
// }

async function fetchQuestionList(category = null) {
    return new Promise((resolve, reject) => {
        Tracker.autorun((c) => {
            Meteor.subscribe('questions', category);
            let questionlist = Questions.find({}).fetch();
            console.log("questionlist >> ", questionlist)
            if (!!questionlist.length) {
                resolve(questionlist[0].questions);
                stop();
            }
        })
    });
}
export const fetchTestQuestions = async ({commit, state, dispatch, rootState}) => {
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
            console.log("CONTINUE!!!!!!!");
            if (!!params.name) {
                if (routename==='fixedtest') {
                    let questions = fetchFixedTest(rootState.route.params, questionslist);
                    // return questions;
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
                
                commit('UPDATE_TEST_QUESTIONS', _.shuffle(_.flatten(questions)));
                // return _.shuffle(_.flatten(questions));
            }
            // }
           
        }
const fetchFixedTest  = (params, questionlist) =>  {
        let type = params.category;
        let name = params.name;
            let fixedTestByCategory = _.find(this.fixedtests, {type});
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
                questionListByCategory = _.map(questionListByCategory, function(arr, key) {
                    arr = _.map(arr, question => {
                        let identifier = { ['type.value']: question.type.value };
                        for (var i = 0; i<questionlist.length;i++) {
                            // TODO.. use _id's when implemented
                            let q = questionlist[i]
                            if (q.question===question.question) {
                                return i;
                            }
                        }
                        return -1
                    })
                    return {
                        [key]:arr
                    }
                })
                let categoryArray = _.flattenDeep(_.map(questionListByCategory, (a,b,c) => {
                    return Object.keys( a );
                }))

                var count = 0;
                while(count<20) {
                    for (var j = 0; j<categoryArray.length;j++) {
                        let category = categoryArray[j];
                        let index = questionListByCategory[j][category][count];
                        if (!!index) {
                            let question = questionlist[index]
                            let answers = {
                                list: question.answers,
                                correct: question.answers[0]
                            }
                            question.answers = answers;
                            question.chosenAnswer = null;
                            if(questions.length<20) 
                                questions.push(question)    
                        }
                    }
                    count++;
                }
                console.log("2 IN FETCH AUTO >> ", questions);
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
                    questions.push(
                        ...questionGenerator(type, child.value, child.label, 1)
                    ) 
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