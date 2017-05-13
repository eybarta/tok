import { testTypes, categories } from '/imports/api/categories/index.js'
import { Questions } from '/imports/api/collections/questions'
import * as actions from './actions.js'
const state = {
    testTypes,
    // questionIndex: 0,
    fixedtests: null,
    testQuestions: [],
    // questionbank: null,
}

const mutations = {
    // TEST MENU
    UPDATE_TESTMENU (state, data) {
        // state.testMenu = Object.assign({}, menu, data)
        _.merge(state.testMenu, data);
    },
    UPDATE_QUESTION_INDEX (state, index) {
        state.questionIndex = index;
    },
    INIT_FIXED_TESTS (state, tests) {
        state.fixedtests = tests;
    },
    INIT_QUESTIONS (state, questions) { // <! -- ADMIN ONLY
        state.questionbank = questions;
    },
    UPDATE_TEST_QUESTIONS (state, questions) {
        state.testQuestions = questions;
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
        if (!!params.name) {
            // THIS WILL BE THE ACTUAL TEST...
            return [];            
        }
        if (!!params.category) {
            if (params.type==='fixedtest') {
                let fixedTestByCategory = _.find(state.fixedtests, {type: params.category});
                if (!!fixedTestByCategory) {
                    console.log('fixedTestByCategory .. ', fixedTestByCategory);
                    return _.map(fixedTestByCategory.tests, obj => {
                        console.log('OBJ .. ', obj);
                        return {
                            label: obj.name,
                            value: obj.name,
                            questions: obj.questions
                        }
                    })
                }
            }
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
        console.log(">>currentCategory >> ", rootState.route.params);
        return rootState.route.params.category || rootState.route.params.name;
    },
    activeCategory: (state, getters, rootState) => {
        
        let params = rootState.route.params;
        console.log(">>activeCategory >> ", params);
        
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
                if (!!cat && key=='name') {
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
}

export const testsModule = {
    namespaced:true,
    mutations,
    getters,
    actions,
    state
}