// import { isAdmin } from '/imports/vuex/getters'
// import { mapGetters } from 'vuex'
// pages
import Home from '/imports/client/ui/pages/Home.vue';
// Admin
import AdminHome from '/imports/client/ui/pages/admin/Home.vue';
import ManageUsers from '/imports/client/ui/pages/admin/ManageUsers.vue';
import CreateTest from '/imports/client/ui/pages/admin/CreateTest.vue';
import AddQuestion from '/imports/client/ui/pages/admin/forms/AddQuestion.vue';
// User
import UserHome from '/imports/client/ui/pages/users/Home.vue';
import ActiveTest from '/imports/client/ui/user/partials/ActiveTest.vue'
// components
import ItemMenu from '/imports/client/ui/components/ItemMenu.vue'

export const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		beforeEnter: (to, from, next) => {
			let userId = Meteor.userId();
			if (!!userId) {
				// let roles = Roles.getRolesForUser(userId);
				// console.log("ROLES FOR USER >> ", roles);
				if (Roles.userIsInRole(userId, 'admin')) {
					console.log('Admin user');
					// user is Admin
					next('/admin')
				} else {
					console.log('User user');
					let user = Meteor.user();
					next({ name: 'user', params: { username: user.username }})
					// { name: 'cart', params: { cartId: cart._id }}
				}
			}
			else {
				console.log('next in home route');
				next()
			}
		}
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
		beforeEnter: (to, from, next) => {
			console.log("ADMINHOME BEFORE ENTER");
			let userId = Meteor.userId();
			console.log("userId >> ", userId);
			if (!!userId && Roles.userIsInRole(userId, 'user')) {
				console.log('is user');
				let username = Meteor.user().username;
				next({ name: 'user', params: { username }})
			}
			else if (!!userId && Roles.userIsInRole(userId, 'admin')) {
				console.log(' admin?');
				next()
			}
			else {
				next('/')
			}
		},	
	},
	{
		path: '/user/:username',
		name: 'userhome',
		component: UserHome,
		beforeEnter: (to, from, next) => {
			console.log("USERHOME BEFORE ENTER");
			let userId = Meteor.userId();
			
			if (!!userId && Roles.userIsInRole(userId, 'user')) {
				console.log('is user');
				next()
			}
			else if (!!userId && Roles.userIsInRole(userId, 'admin')) {
				console.log(' admin?');
				next('/admin')
			}
			else {
				next('/')
			}
		},		
		children: [

			{
				path: '/practice/:category/:name',
				name: 'practice',
				component: ActiveTest
			},
			{
				path: '/fixedtest/:category/:name',
				name: 'fixedtest',
				component: ActiveTest
			},
			{
				path: '/autotest/:category',
				name: 'autotest',
				component: ActiveTest
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
				children: [
					{
						path: ':type',
						name: 'type',
						children: [
							{
								path: ':category',
								name: 'category',
							}
						]
					},
					// {
					// 	path: '/fixedtest/',
					// 	name: 'type',
					// 	children: [
					// 		{
					// 			path: ':category',
					// 			name: 'category',
					// 		}
					// 	]
					// }
				]
			},
			
			
			
		]
	},
	{
		path: '*',
		name: 'NotFound',
		components: Home,
		beforeEnter: (to, from, next) => {
			console.log('** Not found ?? wtf');
		}		
	}
]

