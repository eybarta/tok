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

    questions: (state, getters, rootState) => {
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
            return questionGenerator(category.value, subcategory.value, subcategory.label, 20);
        }
        else if (/test/gi.test(routename)) {
            let questions;
            console.log("(params.activetest) QUESTIONS GETTER >> params ", params);
            if (routename==='autotest') {
                questions = generateAutotest(params.category);
            }
            else if (routename==='adaptivetest') {
                console.log("(params.adaptivetest) QUESTIONS GETTER >> params ", params);
                
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