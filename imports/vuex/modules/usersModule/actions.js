import { Meteor } from 'meteor/meteor'
import { Tracker }from 'meteor/tracker'
import * as types from './mutation-types';
// USER ID
export const initUser = ({ commit, dispatch }, loggingout) => {
    if (!!loggingout) {
        console.log('[ACTION::initUser] loggingout >> ', loggingout);
        commit('INIT_USER', null);
        // dispatch('loadingUser', false);
    }
    else {
        let user = Meteor.user();
        commit('INIT_USER', user)
    }
        

}
export const loadingUser = ({commit}, bool) => {
    commit('LOADING_USER', bool);
}
// ALL USERS DATA ( Admin only subscription)
export const initUsers = ({ commit }, filter) => {
    console.log("[ACTIONS:initUsers] :: ", filter);
    commit('LOADING_USERS', true)

    Tracker.autorun((c) => {
        let usersSub;
        if (!!filter) {
            if (filter.type === 'date') {
                usersSub = Meteor.subscribe('usersByDate', filter);    
                
            }
        }
        else {
            usersSub = Meteor.subscribe('allusers');
        }
        // let usercountSub = Meteor.subscribe('usercount');
        /*  Add 'selected' attribute for 
            client reactive Vue manipulations
        */
        console.log("usercount > ", Meteor.users.find().count())
        // if (usercountSub.ready()) {
        //     console.log("[ACTIONS:usercountSub]>>> usercountSub ready: ", usercountSub.ready());
        //     let userCount = Meteor.users.find().count();
        //     console.log('userCount > ', userCount);
        // }
        if (usersSub.ready()) {
            console.log("[ACTIONS:initUsers]>>> userssub ready: ", usersSub.ready());
            let users = Meteor.users.find({ '_id': { $ne: Meteor.userId() }}).fetch();
            console.log("[ACTIONS:initUsers]>>> users: ", users);
            
            if (!!users) {
                _.each(users, obj => { obj.selected = false;})
                
            }
            console.log("[ACTIONS:initUsers]>>> users to commit: ", users);
            // console.log("users... ", users, ' :: ', users.length, " :: ", usersSub.ready());
            commit('INIT_USERS', users);
            // c.stop();
        }
    })
}

export const saveUsers = async ({ commit, dispatch }, data) => {
        let get_users = Meteor.call('users.save', data, async (error, result) => {
            console.log('saved users?', error, result);
            if (!!result && !!result.users) {
                _.each(result.users, user => {
                    delete user.profile
                })
                console.log("!!result.users", !!result.users);
                let csvContent = Papa.unparse(result.users);
                // commit('USER_LOGINS', result.users)
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
    profile.profile.group = new Date(moment(profile.profile.group, 'D/M/YYYY'))
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

    console.log('[ACTION] updateMultipleUserProfiles :: profile > ', profile);
    if (!!profile.profile.group) {
        profile.profile.group = new Date(moment(profile.profile.group, 'D/M/YYYY'));
    }
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