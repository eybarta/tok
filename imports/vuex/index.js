import { categories } from '/imports/api/categories'
import * as actions from './actions'



const state = {
    user: {
        roles:[]
    },
    users: [],
    userLogins: null,
    popup: {
        active:false,
        type: null,
        data: null,
        title:null
    },
    testTypes:  [
        {
            label:'תרגול',
            value: 'practice'
        },
        {
            label: 'מבחנים',
            value: 'autotest'
        },
        {
            label: 'מבחנים קבועים',
            value: 'fixedtest'
        },
        {
            label: 'מבחן אדפטיבי',
            value: 'adaptivetest'
        }
    ]
}

const mutations = {
    INIT_USER (state, user) {
        state.user = user;
    },
    INIT_USERS (state, users) {
        state.users = users
    },
    USER_LOGINS (state, users) {
        state.userLogins = users;
    },
    SAVE_TEST_TO_USER (state, user) {

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
        let params = state.route.params;
        let category = params.category;
        console.log("currentmenuItems >> ");
        console.log("params >> ", params);
        console.log("category >> ", category);
        if (!!params.activetest) {
            // THIS WILL BE THE ACTUAL TEST...
            return [];            
        }
        if (!!params.category) {
            let cat = _.find(categories, { value: category})
            return cat.children;
        }
        else if (!!params.type) {
            return categories;            
        }
        else {
            return state.testTypes
        }

    },
    currentCategory: (state) => {
        return state.route.params.category;
    },
    activeUser: (state) => {
        // let user = Meteor.user();
        
        Tracker.autorun((c) => {
            let userId = Meteor.userId();
            if (!!userId) {
                let user = Meteor.user();
                console.log('USER GET ', user);
                return user;
                // Meteor.setTimeout(function() {
                //     c.stop();
                // }, 3000)
            } else {
                return null;
            }
        })
    },
    activeCategory: state => {
        let params = state.route.params;
        if (!!params.category) {
            return _.find(categories, {value:params.category});
        }
        return null
    },
    breadCrumbs: (state, getters) => {
		// return Array to render for breadCrumbs
        let cat = getters.activeCategory;
        let label, name, order;
		    bc = _.map(state.route.params, function(value,key, obj){
                console.log("bc>>>>> ", value, " :: ", key, " :: ", obj);
                if (key=='username') {
                    label = '<i class="fa fa-home"></i>';
                    name = 'userhome';
                    order = 0;
                }
                if (key=='type') {
                    // cat = _.find(categories, {value});
                    label = _.find(state.testTypes, {value}).label
                    name = key;
                    order = 1;
                }
                if (!!cat && key=='category') {
                    // cat = _.find(categories, {value});
                    label = _.get(cat, 'label')
                    name = key;
                    order = 2;
                }
                if (!!cat && key=='activetest') {
                    let tests = _.find(cat.children, {value});
                    console.log('tests >> ', tests)
                    label = _.get(tests, 'label')
                    name = key;
                    order = 3;
                }
                return {
                    name,
                    params: { [key]: value },
                    label,
                    order
                }
		    })
		return _.orderBy(bc, 'order');
	},
}


export const storeconfig = {
    mutations,
    getters,
    actions,
    state
}