import { categories } from '/imports/api/categories'
import * as actions from './actions'

const state = {
    popup: {
        active:false,
        type: null,
        data: null,
        title:null
    }
}

const mutations = {
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
   
    
}


export const globalStore = {
    namespaced:true,
    mutations,
    getters,
    actions,
    state
}