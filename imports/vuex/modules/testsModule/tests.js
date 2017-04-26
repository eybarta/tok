import { testTypes, categories } from '/imports/api/categories/index.js'
import { questionGenerator } from '/imports/api/questionGenerator'
import * as actions from './actions.js'

const state = {
    testTypes,
    questionIndex: 0,
}

const mutations = {
    // TEST MENU
    UPDATE_TESTMENU (state, data) {
        // state.testMenu = Object.assign({}, menu, data)
        _.merge(state.testMenu, data);
    },
    UPDATE_QUESTION_INDEX (state, index) {
        state.questionIndex = index;
    }
}

const getters = {
    currentMenuItems: (state,getters,rootState) => {
        console.log("rootState >> ", rootState.route);
        let params = rootState.route.params;
        let category = params.category;
        console.log("currentmenuItems >> ");
        console.log("params >> ", params);
        console.log("category >> ", category);
        if (!!params.activepractice) {
            // THIS WILL BE THE ACTUAL TEST...
            return [];            
        }
        if (!!params.category) {
            let cat = _.find(categories, { value: category})
            return cat.children;
        }
        else if (!!params.type) {
            return categories;            
        }
        else {
            return state.testTypes
        }

    },
    currentCategory: (state, getters, rootState) => {
        return rootState.route.params.category || rootState.route.params.activetest;
    },
    activeCategory: (state, getters, rootState) => {
        let params = rootState.route.params;
        if (!!params.category) {
            return _.find(categories, {value:params.category});
        }
        return null
    },
    breadCrumbs: (state, getters, rootState) => {
		// return Array to render for breadCrumbs
        let cat = getters.activeCategory;
        let label, name, order;
		    bc = _.map(rootState.route.params, function(value,key, obj){
                console.log("bc>>>>> ");
                cl({value});
                cl({key});
                // , , " :: ", key, " :: ", obj);
                if (key=='username') {
                    label = '<i class="fa fa-home"></i>';
                    name = 'user';
                    order = 0;
                }
                if (key=='type') {
                    // cat = _.find(categories, {value});
                    label = _.find(state.testTypes, {value}).label
                    name = key;
                    order = 1;
                }
                if (!!cat && key=='category') {
                    // cat = _.find(categories, {value});
                    label = _.get(cat, 'label')
                    name = key;
                    order = 2;
                }
                if (!!cat && key=='activepractice') {
                    let tests = _.find(cat.children, {value});
                    console.log('tests >> ', tests)
                    label = _.get(tests, 'label')
                    name = key;
                    order = 3;
                }
                return {
                    name,
                    params: { [key]: value },
                    label,
                    order
                }
		    })
		return _.orderBy(bc, 'order');
	},

    questions: (state, getters, rootState) => {
        let params = rootState.route.params;
        if (!!params.activepractice) {
            return questionGenerator(params.category, params.activepractice, 20);
        }
        else if (!!params.activetest) {
            let questions;
            if (params.type==='autotest') {
                questions = generateAutotest(params);
            }
            else if (params.type==='adaptivetest') {
                questions = generateAdaptivetest(params, rootState.usersModule.user);
            }
            
            
            return _.shuffle(_.flatten(questions));
        }
    }
}

function generateAutotest(params) {
    let questions = [];
    let category = _.find(categories, { value: params.activetest});
    let children = category.children;
    _.each(children, child => {
        questions.push(
            questionGenerator(params.activetest, child.value, 1)
        ) 
    })
    while(questions.length<20) {
        let child = children[_.random(0, children.length)];
        questions.push(
            questionGenerator(params.activetest, child.value, 1)
        ) 
    }
    return questions;
}
function generateAdaptivetest(params, user) {
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
        let category = _.find(categories, { value: params.activetest});
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
                        console.log("type to generate=== ", params.activetest, type.value, amount);
                        questions.push(...questionGenerator(params.activetest, type.value, amount))
                    }
                }
            }
        }
        console.log("final adpative questions>> ", questions);
        return questions;

    }
}


export const testsModule = {
    namespaced:true,
    mutations,
    getters,
    actions,
    state
}