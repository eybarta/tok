import { globalStore } from './modules/global'
import { usersModule } from './modules/usersModule/users'
import  { testsModule } from './modules/testsModule/tests'

export const storeconfig = {
    modules: {
        globalStore,
        usersModule,
        testsModule
    }
}