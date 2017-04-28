import { testTypes, categories } from '/imports/api/categories/index.js'
import { questionGenerator } from '/imports/api/generators/questionGenerator'
import { generateAutotest, generateAdaptivetest } from '/imports/api/generators/testGenerator'
import * as actions from './actions.js'

const state = {
    testTypes,
    questionIndex: 0,
    fixedtests: null
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
            let category = getters.activeCategory;
            let subcategory = _.find(category.children, { value: params.activepractice});
            return questionGenerator(category.value, subcategory.value, subcategory.label, 20);
        }
        else if (!!params.activetest) {
            let questions;
            if (params.type==='autotest') {
                questions = generateAutotest(params.activetest);
            }
            else if (params.type==='adaptivetest') {
                questions = generateAdaptivetest(params, rootState.usersModule.user);
            }
            
            
            return _.shuffle(_.flatten(questions));
        }
    }
}

export const testsModule = {
    namespaced:true,
    mutations,
    getters,
    actions,
    state
}