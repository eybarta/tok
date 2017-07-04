<template> 
<main>
    <div v-if="!!apploaded && !user" v-blaze="'login'"></div>
     
    <router-view></router-view>
</main>
</template>
<script>
import AdminHome from '/client/ui/admin/Home.vue'
import UsersHome from '/client/ui/user/Home.vue'
import { mapState, mapGetters, mapActions } from 'vuex'

    export default {
        created() {
            console.log("this route ::: ", this.route)
            if (this.route.name==='logout') {
                this.loadApp();
            }
        },
        mounted() {
            console.log('$("#at-field-username_and_email") >> ', $("#at-field-username_and_email"));
	        $("#at-field-username_and_email").attr('placeholder', 'שם משתמש או אימייל')
            $("#at-field-password").attr('placeholder', 'סיסמא');

            if (!!this.user) {
                this.initFixedTests();
                this.initImagesCollection();
            }
        },
        components: {
            AdminHome,
            UsersHome
        },
        methods: {
            ...mapActions('globalStore', [
                'loadApp'
            ]),
            ...mapActions('testsModule', [
                'initFixedTests',
                //temp
                'initImagesCollection'
            ])
        },
        computed: {
            ...mapState([
                'route'
            ]),
            ...mapState('globalStore', [
                'apploaded',
            ]),
            ...mapState('usersModule', [
                'user'
            ]),
            ...mapGetters('usersModule', [
                'isAdmin'
            ]),
            currentView() {
                return !!this.isAdmin ? 'AdminHome' : 'UsersHome'
            }
        }
    }
</script>
<style lang="stylus">
main
    padding 100px 0 0

</style>