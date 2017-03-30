import { Meteor } from 'meteor/meteor'
import { Tracker }from 'meteor/tracker'
import * as types from './mutation-types';
// USER ID
export const initUser = async ({ commit }) => {
    console.log("initUser to vuex");
    let user = Meteor.user();
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
                await dispatch('downloadCSV', csvContent)
                dispatch('closePopup')
            } else {
                dispatch('closePopup')
            }
        })
}

// USER
export const saveUserProfile = ({ commit, state, dispatch}, data) => {
    console.log("user profile >> ", state.user, " :: ", data);
    let profile = { 'profile': _.pickBy(data.profile)}
    let userId = data.userId || state.user._id;
    console.log('PROFILE', profile);
    console.log('USERID', userId);
    Meteor.call('user.saveprofile', userId, profile);
    dispatch('closePopup')
}
export const dirtifyUser = ({ commit, state }) => {
    return new Promise((resolve, reject) => {
        Meteor.call('user.dirtify', state.user, result => {
            resolve();
        })
    });
}