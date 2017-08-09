<template> 
<main :class="[!!apploaded && !user ? 'login-bg' : '']">
<!--
    <img class="home-logo" src="/img/etz-logo.svg" alt="עץ הדעת">
    -->
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
	        $("#at-field-username_and_email").attr('placeholder', 'שם משתמש או אימייל')
            $("#at-field-password").attr('placeholder', 'סיסמא');

            
        },
        components: {
            AdminHome,
            UsersHome
        },
        methods: {
            ...mapActions('globalStore', [
                'loadApp'
            ]),
            // ...mapActions('testsModule', [
            //     'initFixedTests',
            //     //temp
            //     'initImagesCollection'
            // ])
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
@import '~imports/styl/lib/rupture.styl'
main
    padding 100px 0 0

.home-logo
    position absolute
    top 2vh
    left 2vh
    width 18vmin
    opacity 0.9
    transition opacity 400ms ease
    &:hover
        opacity 1
</style>