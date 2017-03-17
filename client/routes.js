
// pages
import Home from '/imports/ui/pages/Home.vue';
// import Practice
// Admin
import ManageUsers from '/imports/ui/pages/admin/ManageUsers.vue';


export const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
	},

	{
		path: '/practice',
		name: 'practice',
		component: Practice,
		children: [
			{
				path: '/series',
				name: 'series',
				component: Series
			},
			{
				path: '/matrices',
				name: 'matrices',
				component: Matrices
			}
		]
		
	},
	{
		path: '/manageUsers',
		name: 'manageUsers',
		component: ManageUsers
	}
]

