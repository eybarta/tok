import Vue from 'vue';
import Vuex from 'vuex';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(Vuex);




// PLUGINS
import {routes} from './routes';
import {storeconfig} from '/imports/vuex/';

import { sync } from 'vuex-router-sync';
import '/imports/startup/client';
import '/imports/startup/client/account-config.js';

const store = new Vuex.Store(storeconfig);

const router =  new VueRouter({
  mode: 'history',
  routes
})

// Global Guard
router.beforeEach((to, from, next) => {
  // ...
  console.log("before route>> ", to, " :: ", from);
  if (!!Meteor.userId) {
    console.log('logged in');
    next()
  } else {
    next('/')
  }
})


sync(store, router);
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