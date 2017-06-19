import * as actions from './actions'

const state = {
    user: {
        roles:[]
    },
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
}

const getters = {
   
    // activeUser: (state) => {
    //     // let user = Meteor.user();
        
    //     Tracker.autorun((c) => {
    //         let userId = Meteor.userId();
    //         if (!!userId) {
    //             let user = Meteor.user();
    //             console.log('USER GET ', user);
    //             return user;
    //             // Meteor.setTimeout(function() {
    //             //     c.stop();
    //             // }, 3000)
    //         } else {
    //             return null;
    //         }
    //     })
    // },
     isAdmin: (state) => {
        let user = state.user;
        console.log('>> user >> ', user);
        if (!!user && user.roles) {
            return user.roles.indexOf('admin')>-1
        }
        return false;
    }
}


export const  usersModule = {
    namespaced:true,
    mutations,
    getters,
    actions,
    state
}