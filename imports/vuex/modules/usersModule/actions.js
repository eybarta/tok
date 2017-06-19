import { Meteor } from 'meteor/meteor'
import { Tracker }from 'meteor/tracker'
import * as types from './mutation-types';
// USER ID
export const initUser = async ({ commit }) => {
    let user = Meteor.user();
    console.log("initUser to vuex >> ", user);
    commit('INIT_USER', user);
}

// ALL USERS DATA ( Admin only subscription)
export const initUsers = ({ commit }) => {
    Tracker.autorun((c) => {
        Meteor.subscribe('allusers');
        let users = Meteor.users.find({ '_id': { $ne: Meteor.userId() }}).fetch();

        /*  Add 'selected' attribute for 
            client reactive Vue manipulations
        */
        _.each(users, obj => { obj.selected = false;})

        if (!!users) {
            commit('INIT_USERS', users)
            stop();
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