import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);


import {routes} from './routes'
export const router =  new VueRouter({
  mode: 'history',
  routes
})


// router.beforeEach((to, from, next) => {
//   // ...
//   let userId =  Meteor.userId();
//   console.log("before route>> ", to, " :: ", from);
//   if (to.matched.length<1) {
//     next('/')
//   }
//   else if (!userId) {
//     if (to.path!='/') {
//       next('/')
//     }
//     else {
//       next()
//     }
//   }
//   else if (!!userId) {
//     console.log('logged in');
//     // Don't go anywhere until you have the user object
//     Tracker.autorun((c) => {
//       let user = Meteor.user();
//       if (!!user) {
//         console.log('user >> ', user)
//         store.dispatch('initUser');
//         next()
//       }
//     })
//   } 
//   else {
//     console.log('else why why??');
//     next('/');
//     // router.push('/')
//   }
// })