<template> 
<main>
    <div v-if="!user || !user._id" v-blaze="'login'"></div>
    <router-view></router-view>
    <!--<component v-else :is="currentView"></component>-->
</main>
</template>
<script>
import AdminHome from './admin/Home.vue'
import UsersHome from './users/Home.vue'
import { mapState, mapGetters } from 'vuex'

    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        components: {
            AdminHome,
            UsersHome
        },
        computed: {
            ...mapState('usersModule', [
                'user'
            ]),
            ...mapGetters('usersModule', [
                'isAdmin'
            ]),
            loggedIn() {

            },
            currentView() {
                return !!this.isAdmin ? 'AdminHome' : 'UsersHome'
            }
        }
    }
</script>
<style lang="stylus">
main
    padding 100px 10%
</style>