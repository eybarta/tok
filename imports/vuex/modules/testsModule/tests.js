import { testFormats, categories } from '/imports/api/categories/index.js'
import { Questions } from '/imports/api/collections/questions'
import * as actions from './actions.js'
const state = {
    testFormats,
    // questionIndex: 0,
    fixedtests: null,
    testQuestions: [],
    images: null,
    questionbank: null,
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
        console.log('UPDATE_TEST_QUESTIONS << ', questions)
        state.testQuestions = questions;
    },
    INIT_IMAGES_COLLECTION (state, images) {
        state.images = images;
    }
}

const getters = {
    fixedTestsList: (state, getters) => {
        let category = !!getters.activeCategory ? getters.activeCategory.value : null;
        if (!!category) {
            let testsOfCategory = _.find(state.fixedtests, {type:category})
            if (!!testsOfCategory) {
                return testsOfCategory.tests;
            }
        }
        return null;
    },
    hasFixedTestsList: (state) => {
        return !!state.fixedtests
    },
    currentMenuItems: (state,getters,rootState) => {
        console.log("rootState >> ", rootState.route);
        let params = rootState.route.params;
        let category = params.category;
        console.log("currentmenuItems >> ");
        console.log("params >> ", params);
        console.log("#### category >> ", category);
        if (!!params.name) {
            // THIS WILL BE THE ACTUAL TEST...
            return [];            
        }
        if (!!params.category) {
            if (params.format==='fixedtest') {
                let fixedTestByCategory = _.find(state.fixedtests, {type: params.category});
                console.log('fixedTestByCategory >',fixedTestByCategory) ;
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
                else {
                    return null;
                }
            }
            let cat = _.find(categories, { value: category})
            return cat.children;
        }
        else if (!!params.format) {
            return categories;            
        }
        else {
            return state.testFormats
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
                if (key=='format') {
                    // cat = _.find(categories, {value});
                    label = _.find(state.testFormats, {value}).label
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