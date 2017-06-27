import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import { globalStore } from './modules/global'
import { usersModule } from './modules/usersModule/users'
import  { testsModule } from './modules/testsModule/tests'

const storeconfig = {
    modules: {
        globalStore,
        usersModule,
        testsModule
    }
}
export default new Vuex.Store(storeconfig);
