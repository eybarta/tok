import { Meteor } from 'meteor/meteor'
import { Tracker }from 'meteor/tracker'
import * as types from './mutation-types';
// USER ID
export const initUser = async ({ commit, dispatch }, loggingout) => {
    var trackuser, timeuser;
    dispatch('loadingUser', true);
    if (!!loggingout) {
        commit('INIT_USER', null);
        dispatch('loadingUser', false);
    }
    else {
        return new Promise((resolve, reject) => {
            
            Tracker.autorun((c) => {
                let usersSub = Meteor.subscribe('allusers');
                let user = Meteor.users.find({ '_id': Meteor.userId()}).fetch();
                /*  Add 'selected' attribute for 
                    client reactive Vue manipulations
                */
                if (usersSub.ready()) {
                    console.log("users... ", user, ' :: ', user.length, " :: ", usersSub.ready());
                    if (!!user && !!user.length) {
                        commit('INIT_USER', user[0])
                        dispatch('loadingUser', false);
                        resolve(user[0])
                    }
                    else {
                        commit('INIT_USER', null)
                        dispatch('loadingUser', false);
                        resolve(null)
                        // c.stop();
                    }
                }
            })
        })
        // return new Promise((resolve, reject) => {
        //     var user;
        //     trackuser = Tracker.autorun((c) => {
        //         user = Meteor.user();
        //         console.log("initUser to vuex >> ", user);
        //         console.log("Account user to vuex >> ", Accounts.user());
        //         if (!!user) {
        //             Meteor.clearTimeout(timeuser);
        //             let roles = Roles.getRolesForUser(user);
        //             console.log("got user.. now Roles> ", roles);
        //             if (roles.length > 0) {
        //                 commit('INIT_USER', user);
        //                 c.stop();
        //                 resolve(user);
        //             }
        //         }
        //     })
        //     timeuser = Meteor.setTimeout(function () {
        //         if (!user) {
        //             trackuser.stop();
        //             commit('INIT_USER', null);
        //             resolve(false);
        //         }
        //     }, 8000)
        // });
    }
        

}
export const loadingUser = ({commit}, bool) => {
    commit('LOADING_USER', bool);
}
// ALL USERS DATA ( Admin only subscription)
export const initUsers = ({ commit }) => {
    Tracker.autorun((c) => {
        let usersSub = Meteor.subscribe('allusers');
        let users = Meteor.users.find({ '_id': { $ne: Meteor.userId() }}).fetch();

        /*  Add 'selected' attribute for 
            client reactive Vue manipulations
        */
        if (usersSub.ready()) {
            if (!!users) {
                _.each(users, obj => { obj.selected = false;})
                
            }
            // console.log("users... ", users, ' :: ', users.length, " :: ", usersSub.ready());
            commit('INIT_USERS', users)
            c.stop();
        }
    })
}

export const saveUsers = async ({ commit, dispatch }, data) => {
        let get_users = Meteor.call('users.save', data, async (error, result) => {
            console.log('saved users?', error, result);
            _.each(result.users, user => {
                delete user.profile
            })
            if (!!result && !!result.users) {
                console.log("!!result.users", !!result.users);
                let csvContent = Papa.unparse(result.users);
                commit('USER_LOGINS', result.users)
                console.log('csvContent.. ', csvContent);
                await dispatch('globalStore/downloadCSV', csvContent, {root:true})
                dispatch('globalStore/closePopup', null, {root:true})
            } else {
                dispatch('globalStore/closePopup', null, {root:true})
                
            }
        })
}

// USER
export const saveUserProfile = ({ commit, state, dispatch}, data) => {
    let profile = { 'profile': _.pickBy(data.profile)}
    let userId = data.userId || state.user._id;
    Meteor.call('user.saveprofile', userId, profile);
    dispatch('globalStore/closePopup', null, {root:true})
}
export const deleteUser = ({commit, state, dispatch}, userId) => {
    Meteor.call('user.delete', userId);
    dispatch('globalStore/closePopup', null, {root:true})
}
export const updateMultipleUserProfiles = ({ commit, state, dispatch}, data) => {
    let userIds = data[0];
    let profile = data[1];
    Meteor.call('users.updateprofiles', userIds, profile);
    dispatch('globalStore/closePopup', null, {root:true})
}
export const dirtifyUser = ({ commit, state }) => {
    return new Promise((resolve, reject) => {
        Meteor.call('user.dirtify', state.user, result => {
            resolve();
        })
    });
}
export const signOutUser = ({commit,rootState}) => {
    AccountsTemplates.logout();
    console.log(rootState);
    commit("SIGN_OUT_USER");
}