import Vue from 'vue';
import Vuex from 'vuex';
import {Meteor} from 'meteor/meteor';
import { Tracker }from 'meteor/tracker'
import {Accounts} from 'meteor/accounts-base'

Vue.use(Vuex);


import VueMultiselect from 'vue-multiselect'
Vue.component('Multiselect', VueMultiselect)

// PLUGINS

import { sync } from 'vuex-router-sync';
import '/imports/startup/client';
import '/imports/startup/client/account-config.js';

import {storeconfig} from '/imports/vuex/';
import { router } from '/imports/startup/client/router'

console.log('storeconfig  ', storeconfig)
const store = new Vuex.Store(storeconfig);



sync(store, router);
console.log("*****STORE >> ", store);
// Global Guard
router.beforeEach((to,from,next) => {
    console.log("TO:", to);
    let userState = store.state['usersModule'];

      let userId =  Meteor.userId();
      if (!!userId) {
        console.log("has userId >> ", userId);
        if (!userState.user.roles.length) {
          console.log('user not hoooked >> wait for user data')
          // Don't go anywhere until you have the user object
          Tracker.autorun((c) => {
            let user = Meteor.user();
            if (!!user) {
              let roles = Roles.getRolesForUser(user);
              if (roles.length>0) {
                store.dispatch('usersModule/initUser');
                next()
                stop()
              }        
            }
          })
        }
        else {
            console.log('user hooked (has roles) >> ', userState.user.roles);
            next()
        }
      }
      else {
        console.log('user not logged in >> go home');
        if (to.name!='home') {
          next('/')
        }
        else {
          next()
        }
      }
})
// Libs
_ = lodash;

import App from '/imports/ui/App.vue';

Vue.config.devtools = true;
Vue.config.debug = true;

// App start
Meteor.startup(() => {
  new Vue({
    router,
    render: h => h(App),
    store,
    mounted() {
    }
  }).$mount('app');

});


// FOR DEBUGGING
l = (...args) => {
  console.log("DEBUG|| ", args);
}

cl = (...args) => {
  _.each(args, obj => {
    for(key in obj)
      console.info(key + ': ' + obj[key]);
  })
}