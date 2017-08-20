import store from '/imports/vuex'

import * as actions from './actions'

const state = {
    user: null,
    loadinguser: false,
    loadingusers: false,
    loadingMoreUsers: false,
    users: [],
    usersOnline: null,
    loadingstatistics: false,
    statisticsData: null
    // userLogins: null,
}

const mutations = {
    INIT_USER (state, user) {
        state.user = user;
    },
    INIT_USERS (state, users) {
        state.loadingusers = false;
        state.users = users
    },
    USERS_ONLINE(state, usersOnline) {
        state.usersOnline = usersOnline;
    },
    // USER_LOGINS (state, users) {
    //     state.userLogins = users;
    // },
    SIGN_OUT_USER (state) {
        state.user = null;
    },
    LOADING_USER(state, bool) {
        state.loadinguser = bool;
    },
    LOADING_USERS(state, bool) {
        state.loadingusers = bool;
    },
    LOADING_STATISTICS(state, bool) {
        state.loadingstatistics = bool;
    },
    STATISTICS_DATA(state, data) {
        state.statisticsData = data;
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
        if (!!user && !!user.length && !!user.profile.tests) {
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