// import { isAdmin } from '/imports/vuex/getters'
// import { mapGetters } from 'vuex'
// pages
import Home from '/imports/ui/pages/Home.vue';
// Admin
import AdminHome from '/imports/ui/pages/admin/Home.vue';
import ManageUsers from '/imports/ui/pages/admin/ManageUsers.vue';

// User
import UserHome from '/imports/ui/pages/users/Home.vue';
import ActiveTest from '/imports/ui/user/partials/ActiveTest.vue'
// components
import ItemMenu from '/imports/ui/components/ItemMenu.vue'

export const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		beforeEnter: (to, from, next) => {
			console.log('before enter home ****************');
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
					next({ name: 'userhome', params: { id: user.username }})
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
		],
		beforeEnter: (to, from, next) => {
			console.log("ADMINHOME BEFORE ENTER");
			let userId = Meteor.userId();
			
			if (!!userId && Roles.userIsInRole(userId, 'user')) {
				console.log('is user');
				next({ name: 'userhome', params: { id: userId }})
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
		path: '/user/:id',
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
				path: ':type',
				name: 'type',
				component: ItemMenu,
				
				children: [
					{
						path: ':category',
						name: 'category',
					}
				]
			},
			{
				path: ':type/:category/:activetest',
				name: 'activetest',
				component: ActiveTest
			}
			
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

