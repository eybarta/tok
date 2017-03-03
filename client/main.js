import Vue from 'vue';
import Vuex from 'vuex';
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import {Meteor} from 'meteor/meteor';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(Vuex);

// PLUGINS
import VuePaginate from 'vue-paginate'
Vue.use(VuePaginate)
// Vue.use(VueAwesomeSwiper)


// // import {routes} from './routes';
// // import {storeconfig} from '/imports/vuex';

// import { sync } from 'vuex-router-sync';
import '/imports/startup/client';


// const store = new Vuex.Store(storeconfig);

// const router =  new VueRouter({
//   mode: 'history',
//   routes
// })
// sync(store, router);
// Libs
_ = lodash;

// import { initCartsState, initInventoryState, initProductOptions } from '/imports/vuex/actions';
import App from '/imports/ui/App.vue';

Vue.config.devtools = true;
Vue.config.debug = true;

// App start
Meteor.startup(() => {
  
  // Start the router
  new Vue({
    // router,
    render: h => h(App),
    // store,
    mounted() {
    }
  }).$mount('app');
});


// FOR DEBUGGING
l = (...args) => {
  console.log("DEBUG|| ", args);
}