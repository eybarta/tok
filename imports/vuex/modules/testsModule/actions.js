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