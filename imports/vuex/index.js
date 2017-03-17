
import * as actions from './actions'

const state = {
    user: {
        roles:[]
    },
    users: [],
    popup: {
        active:false,
        type: null,
        data: null,
        title:null
    },
    testMenu: {
        category: null, // ['מטריצות', 'סדרות'...]
        type: [
                {
                    label:'תרגול',
                    value: 'practice'
                },
                {
                    label: 'מבחן',
                    value: 'test'
                },
                {
                    label: 'מכינה',
                    value: 'prepare'

                }
            ],
        subcategory: null, //['חיסור', 'חיבור'...]
    }
}

const mutations = {
    INIT_USER (state, user) {
        state.user = user;
    },
    INIT_USERS (state, users) {
        state.users = users
    },
     // MISC
    CLOSE_POPUP (state) {
        state.popup.active = false //!state.popup.active
        state.popup.type = null
        state.popup.data = null
        state.popup.title = null
    },
    CALL_POPUP (state, data) {
        state.popup.active = true;
        state.popup.type = data.type;
        state.popup.data = data.data || state.popup.data || null;
        state.popup.title = data.title || null;
    },
    // TEST MENU
    UPDATE_TESTMENU (state, data) {
        let menu = state.testeMenu
        // state.testMenu = Object.assign({}, menu, data)
        _.merge(state.testMenu, data);
    }
}

const getters = {
    isAdmin: (state) => {
        let user = state.user;
        if (!!user && user.roles) {
            return user.roles.indexOf('admin')>-1
        }
        return false;
    },
    currentMenuItems: (state) => {
        // state.route.params
    },
    breadCrumbs: state => {
		// return Array to render for breadCrumbs
		let params = {};
		let bc = _.map(state.route.params, function(value,key, obj){
			params[key] = value;
			return {
				name: 'results-'+_.split(key, "Filter")[0],
				params: _.clone(params),
				label: value
			}
		})
		return bc;
	},
}


export const storeconfig = {
    mutations,
    getters,
    actions,
    state
}