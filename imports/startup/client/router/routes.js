// vuex store
import store from '/imports/vuex'
console.log("store from router > ", store, " :: ", store.state)
// pages
import Home from '/client/ui/pages/Home.vue';
// Admin
import AdminHome from '/client/ui/admin/Home.vue';
import Statistics from '/client/ui/admin/Statistics.vue';

import ManageUsers from '/client/ui/admin/ManageUsers.vue';
import CreateTest from '/client/ui/admin/CreateTest.vue';
import AddQuestion from '/client/ui/admin/forms/AddQuestion.vue';

// User
import UserHome from '/client/ui/user/Home.vue';
import ActiveTest from '/client/ui/user/partials/ActiveTest.vue'
// components
import ItemMenu from '/client/ui/components/ItemMenu.vue'

function auth() {
	return new Promise((resolve, reject) => {
		let userId = Meteor.userId();
		if (!userId) {
			resolve(null);
			return null;
		}
		Tracker.autorun((c) => {
			var user = Meteor.user();
			if (!!user && !!user.roles && !!user.roles.length) {
				console.log('[AUTH] resolve user.. ', user, user.roles.length, user.profile);
				resolve(user);
				c.stop();
			}
		});
	});
}
function requireAuth(to,from,next) {
	let destination = to.name;
	store.dispatch('usersModule/loadingUser', true);
	auth().then(user => {
		console.log('auth response > ', user);
		if (!user) {
			destination === 'login'
				? next()
				: next({ name: 'login' })
		} else {
			let isAdmin = Roles.userIsInRole(user._id, 'admin');
			if (!!isAdmin) {
				console.log('[ROUTER] isAdmin >> ', isAdmin);
				destination === 'home' || destination === 'login'
					? next('/admin')
					: next();
			}
			else {
				destination === 'home' || destination === 'login'// && !!store.state.globalStore.apploaded
					? next({ name: 'user', params: { username: user.username } })
					: (to.path.indexOf('admin') > -1
						? next('/')
						: next());
			}
		}
		store.dispatch('usersModule/initUser');
		store.dispatch('usersModule/loadingUser', false);
		store.dispatch('globalStore/loadApp')
	});
	
	
}

export const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		beforeEnter: requireAuth,
	},
	{
		path: '/admin',
		name: 'adminhome',
		component: AdminHome,
		children: [
			{
				path: 'statistics',
				name: 'statistics',
				component: Statistics
			},
			{
				path: 'manageUsers',
				name: 'manageUsers',
				component: ManageUsers
			},
			{
				path: 'createTest',
				name: 'createTest',
				component: CreateTest
			},
			{
				path: 'addQuestion',
				name: 'addQuestion',
				component: AddQuestion
			}

		],
		beforeEnter: requireAuth,
	},
	{
		path: '/user/:username',
		name: 'userhome',
		component: UserHome,
		beforeEnter: requireAuth,
		children: [

			{
				path: '/practice/:category/:name',
				name: 'practice',
				component: ActiveTest,
				meta: { test:true}
			},
			{
				path: '/testhistory/:category/:name',
				name: 'testhistory',
				component: ActiveTest,
				meta: { test:true}

			},
			{
				path: '/fixedtest/:category/:name',
				name: 'fixedtest',
				component: ActiveTest,
				meta: { test:true}
			},
			{
				path: 'autotest/:category',
				name: 'autotest',
				component: ActiveTest,
				meta: { test:true}
			},
			{
				path: '/adaptivetest/:category',
				name: 'adaptivetest',
				component: ActiveTest
			},
			{
				path: '/user/:username',
				name: 'user',
				component: ItemMenu,
				// http://localhost:3000/user/03944123
				children: [
					{
						path: ':format',
						name: 'format',
						// /user/03944123/autotest
						children: [
							{
								path: ':category',
								name: 'category',
								// /user/03944123/autotest/series
							}
						]
					},
				]
			},
			
		]
	},
	{
		path: '/login',
		name: 'login',
		component:Home,
		beforeEnter: requireAuth,
	},
	{
		path: '/logout',
		name: 'logout',
		beforeEnter: (to,from,next) => {
			Meteor.logout();
			store.dispatch('usersModule/initUser', true);
			location.reload();
			next('/');
			// console.log('[ROUTER] logout >> go to login >>, ', next);
			// console.log('[ROUTER] next????? ', to,from,next);
		}
	},
	{
		path: '*',
		name: 'NotFound',
		component: Home,
		beforeEnter: requireAuth
	}
]

