import Vue from 'vue';
import Vuex from 'vuex';
import {Meteor} from 'meteor/meteor';
import { Tracker }from 'meteor/tracker'
import {Accounts} from 'meteor/accounts-base'

Vue.use(Vuex);




// PLUGINS
import {storeconfig} from '/imports/vuex/';

import { sync } from 'vuex-router-sync';
import '/imports/startup/client';
import '/imports/startup/client/account-config.js';

const store = new Vuex.Store(storeconfig);

import { router } from '/imports/startup/client/router'




sync(store, router);

// Global Guard
router.beforeEach((to,from,next) => {
  console.log("TO:", to);
  let userId =  Meteor.userId();
  if (!!userId) {
    console.log('logged in');
    // Don't go anywhere until you have the user object
    Tracker.autorun((c) => {
      let user = Meteor.user();
      if (!!user) {
        let roles = Roles.getRolesForUser(user);
        if (roles.length>0) {
          next()
          stop()
        }        
      }
      store.dispatch('initUser');
    })
  }
  else {
    if (to.path!='/') {
      next('/')
    }
    else {
      next()
    }
  }
  store.dispatch('initUser');
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