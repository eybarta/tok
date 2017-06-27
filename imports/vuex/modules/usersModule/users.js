import store from '/imports/vuex'

import * as actions from './actions'

const state = {
    user: null,
    users: [],
    userLogins: null,
}

const mutations = {
    INIT_USER (state, user) {
        state.user = user;
    },
    INIT_USERS (state, users) {
        state.users = users
    },
    USER_LOGINS (state, users) {
        state.userLogins = users;
    },
    SIGN_OUT_USER (state) {
        state.user = null;
    }
}

const getters = {
     isAdmin: (state) => {
        let user = state.user;
        console.log('>> user >> ', user);
        if (!!user && user.roles) {
            return user.roles.indexOf('admin')>-1
        }
        return false;
    },
    userTestHistory: (state, rootState) => {
        let user = state.user;
        let route = rootState.route;
        if (!!user && !!user.profile.tests) {
            return user.profile.tests;
        }
        return false;
    },
    userCurrentCategoryTestHistory: (state, getters, rootState) => {
        let _history = getters.userTestHistory;
        if (!!_history) {
            let category = store.getters['testsModule/activeCategory'];
            console.log(" userCurrentCategoryTestHistory >> category >> ", category, " :: ", store);
            if (!!category) {
                return _.filter(_history, test => {
                    return test.meta.category===category.value
                })
            }
        } else {
            return [];
        }
    }
}


export const  usersModule = {
    namespaced:true,
    mutations,
    getters,
    actions,
    state
}