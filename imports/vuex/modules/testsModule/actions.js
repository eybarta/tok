import { FixedTests } from '/imports/api/collections/fixedtests'
import { Questions } from '/imports/api/collections/questions'

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

// QUESTION BANK
export const initQuestions = ({ commit }) => {
    Tracker.autorun((c) => {
        Meteor.subscribe('questions');
        let questions = Questions.find({}).fetch();
        if (!!questions) {
            commit('INIT_QUESTIONS', questions)
            stop();
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

export const generateTestPage = async ({commit, state, getters}, to) => {
    // return new Promise((resolve, reject) => {
    //     let routename = rootState.route.name;
    //     let params = rootState.route.params;
    //     console.log("QUESTIONS GETTER >> params ", params, " :: ", routename);

    //     if (!!params.name) {
    //         if (routename==='fixedtest') {
    //             let fixedTestByCategory = _.find(state.fixedtests, {type: params.category});
    //             if (!!fixedTestByCategory) {
    //                 let test = _.find(fixedTestByCategory.tests, { name: params.name});
    //                 return test.questions;
    //             }
    //         }
    //         let category = getters.activeCategory;
    //         let subcategory = _.find(category.children, { value: params.name});
    //         return questionGenerator(category.value, subcategory.value, subcategory.label, 20);
    //     }
    //     else if (/test/gi.test(routename)) {
    //         let questions;
    //         console.log("(params.activetest) QUESTIONS GETTER >> params ", params, " ::: ", routename);
    //         if (routename==='autotest') {
    //             commit('POPULATE_TEST', await generateAutotest(params.category))
    //             // questions = await generateAutotest(params.category);
    //             console.log("questions from autotest generator >. ", questions);
    //         }
    //         else if (routename==='adaptivetest') {
    //             console.log("(params.adaptivetest) QUESTIONS GETTER >> params ", params);
    //             questions = generateAdaptivetest(params, rootState.usersModule.user);
    //         }
    //         resolve();
    //     }
    //     return _.shuffle(_.flatten(questions));
    // })
}

export const generateAutotest = async ({commit, state}, category) => {
    if (categoryname!='series') {
        Tracker.autorun((c) => {
            Meteor.subscribe('questions', categoryname);
            // console.log("QQQQQ >>", q);
            let questionsFetched = Questions.find({}).fetch();
            if (!!questionsFetched) {
                console.log("QUESTIONS FROM TRACKER > ", questionsFetched);
                stop();
                return getQuestions(categoryname, questionsFetched);
            }
        })
    }
    else {
        return getQuestions(categoryname);
    }
}
export const generateQuestions = async ({commit, state}, data) => {

}
export const updateQuestionIndex = ({commit, state, getters}, to) => {
    let index = state.questionIndex,
        questionsAmount = getters.questions.length-1
    if (to=='next') {
        index != questionsAmount ? index++ : index=0
    }
    else if (to=='prev') {
        index != 0 ? index-- : index=questionsAmount
    }
    else {
        index = to;
    }
    commit('UPDATE_QUESTION_INDEX', index)
}