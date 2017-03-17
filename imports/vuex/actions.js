import { Meteor } from 'meteor/meteor'
import { Tracker }from 'meteor/tracker'
import * as types from './mutation-types';

import { Users } from '/imports/api/collections/users'

// USER ID
export const initUser = ({ commit }) => {
    console.log("initUser");
    let user = Meteor.user();
    commit('INIT_USER', user);
    
    Tracker.autorun((c) => {
        let userId = Meteor.userId();
        if (!!userId) {
            let user = Meteor.user();
            commit('INIT_USER', user);
            Meteor.setTimeout(function() {
                c.stop();
            }, 3000)
        }
    })
}

// ALL USERS DATA ( Admin only subscription)
export const initUsers = ({ commit }) => {
    Tracker.autorun((c) => {
        let users = Meteor.subscribe('users', null, (err, res) => {
            console.log(err, " :: ", res);
        });
        // let users = Users.find({}).fetch();
        console.log('init users vuex ', users)
        if (!!users) {
            commit('INIT_USERS', users)
            // stop();
        }
    })
}

export const saveUsers = ({ commit }, data) => {
    return new Promise((resolve, reject) => {
        Meteor.call('users.save', data, result => {
            console.log('saved users?', result);
            resolve();
        })
    });
}
export const dirtifyUser = ({ commit, state }) => {
    return new Promise((resolve, reject) => {
        Meteor.call('user.dirtify', state.user, result => {
            resolve();
        })
    });
}
// POPUP
export const closePopup = ({commit}) => {
    commit('CLOSE_POPUP')
}
export const callPopup = ({commit}, data) => {
    console.log("CALL POPUP >> data: ", data);
    commit('CALL_POPUP', data)
}

// TEST MENU
export const updateTestMenu = ({commit}, data) => {
    console.log('update test menu>> ', data);
    commit('UPDATE_TESTMENU', data)
}