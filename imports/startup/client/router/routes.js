// vuex store
import store from '/imports/vuex'
console.log("store from router > ", store)
// pages
import Home from '/client/ui/pages/Home.vue';
// Admin
import AdminHome from '/client/ui/admin/Home.vue';
import ManageUsers from '/client/ui/admin/ManageUsers.vue';
import CreateTest from '/client/ui/admin/CreateTest.vue';
import AddQuestion from '/client/ui/admin/forms/AddQuestion.vue';
// User
import UserHome from '/client/ui/user/Home.vue';
import ActiveTest from '/client/ui/user/partials/ActiveTest.vue'
// components
import ItemMenu from '/client/ui/components/ItemMenu.vue'

async function requireAuth(to,from,next) {
	let destination = to.name;
	let user = await store.dispatch('usersModule/initUser');
	store.dispatch('globalStore/loadApp')
	if (!user) {
		destination==='login'
		? next()
		: next({ name: 'login' })
	} else {
		let isAdmin = store.getters['usersModule/isAdmin'];
		if (!!isAdmin) {
			destination==='home'
			? next('/admin')
			: next();
		}
		else {
			console.log('ROUTE TO USER>> ', to, from);
			destination==='home'
			? next({ name: 'user', params: { username: user.username }})
			: (to.path.indexOf('admin')>-1
				? next('/')
				: next());
		}
	}
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
				component: ActiveTest
			},
			{
				path: '/testhistory/:category/:name',
				name: 'testhistory',
				component: ActiveTest
			},
			{
				path: '/fixedtest/:category/:name',
				name: 'fixedtest',
				component: ActiveTest
			},
			{
				path: 'autotest/:category',
				name: 'autotest',
				component: ActiveTest,
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
		path: '*',
		name: 'NotFound',
		component: Home,
		beforeEnter: requireAuth
	}
]

