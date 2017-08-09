import { categories } from '/imports/api/categories'
import { questionGenerator } from './questionGenerator'
import { Questions } from '/imports/api/collections/questions'


export async function fetchQuestions(state, getters, rootState) {
    return new Promise((resolve, reject) => {
            let routename = rootState.route.name;
            let params = rootState.route.params;
            console.log("QUESTIONS GETTER >> params ", params, " :: ", routename);

            if (!!params.name) {
                if (routename==='fixedtest') {
                    let fixedTestByCategory = _.find(state.fixedtests, {type: params.category});
                    if (!!fixedTestByCategory) {
                        let test = _.find(fixedTestByCategory.tests, { name: params.name});
                        return test.questions;
                    }
                }
                let category = getters.activeCategory;
                let subcategory = _.find(category.children, { value: params.name});
                let questions = questionGenerator(category.value, subcategory.value, subcategory.label, 20);
                resolve(questions)
            }
            else if (/test/gi.test(routename)) {
                let questionPromise;
                let questions;
                console.log("(params.activetest) QUESTIONS GETTER >> params ", params, " ::: ", routename);
                if (routename==='autotest') {
                        console.log('await for question gen!! ..', params.category);
                        questionlist =  generateAutoQuestions(params.category);
                        questions =  generateAutotest(params.category, questionlist)
                        console.log("questions from autotest generator >. ", questions);
                    
                
                }
                else if (routename==='adaptivetest') {
                    console.log("(params.adaptivetest) QUESTIONS GETTER >> params ", params);
                    
                    questions = generateAdaptivetest(params, rootState.usersModule.user);
                }
                
                console.log("return questions  >", questions);
                
                resolve(_.flatten(questions));
            }
        }).then(function(result) {
            return result;
        })
}
export async function generateAutoQuestions(categoryname) {
    // return new Promise((resolve, reject) => {
    //     if (categoryname!='series') {
    //         Tracker.autorun((c) => {
    //             Meteor.subscribe('questions', categoryname);
    //             let questionsFetched = Questions.find({}).fetch();
    //             if (!!questionsFetched.length) {
    //                 stop();
    //                 resolve(questionsFetched[0].questions);
    //             }
    //         })
    //     }
    //     else {
    //         resolve(null);
    //     }
    // }).then(function(result) {
    //     return result;
    // });
}

export async function generateAutotest(categoryname, questionlist) {
    return new Promise((resolve, reject) => {
        let questions = [];
        let category = _.find(categories, { value: categoryname});
        let children = category.children;
        if (!!questionlist) {
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
                        questions.push(question)    
                    }
                    
                }
                count++;
            }

        }
        else {
            _.each(children, child => {
                questions.push(
                    ...questionGenerator(categoryname, child.value, child.label, 1)
                ) 
            })
            while(questions.length<20) {
                let child = children[_.random(0, children.length)];
                if (!!child && !!child.value) {
                    questions.push(
                        ...questionGenerator(categoryname, child.value, child.label, 1)
                    ) 
                }
            }
        }
            resolve(questions);
    }).then(function(result) {
        return result;
    });
}

export function generateAdaptivetest(params, user) {
    console.log('generateAdaptivetest >> ', params);
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