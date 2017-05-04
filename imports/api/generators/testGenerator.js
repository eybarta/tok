import { testTypes, categories } from '/imports/api/categories'
import { questionGenerator } from './questionGenerator'


export function generateAutotest(categoryname) {
    console.log('generate autotest >> ', categoryname);
    let questions = [];
    let category = _.find(categories, { value: categoryname});
    let children = category.children;
    _.each(children, child => {
        questions.push(
            ...questionGenerator(categoryname, child.value, child.label, 1)
        ) 
    })
    while(questions.length<20) {
        let child = children[_.random(0, children.length)];
        questions.push(
            ...questionGenerator(categoryname, child.value, child.label, 1)
        ) 
    }
    return questions;
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
                    return '90'
                    break;
                case(obj.percent>=75):
                    return '75';
                    break;
                case(obj.percent>=50):
                    return '50';
                    break;
                case(obj.percent>=25):
                    return '25';
                    break;
                default:
                    return '0'
                    break;
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