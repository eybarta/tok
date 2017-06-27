<template> 
<main>
    <div v-if="!!apploaded && (!user || !user._id)" v-blaze="'login'"></div>
     
    <router-view></router-view>
</main>
</template>
<script>
import AdminHome from '/client/ui/admin/Home.vue'
import UsersHome from '/client/ui/user/Home.vue'
import { mapState, mapGetters } from 'vuex'

    export default {
        data() {
            return {
            }
        },
        mounted() {
            console.log('$("#at-field-username_and_email") >> ', $("#at-field-username_and_email"));
	        $("#at-field-username_and_email").attr('placeholder', 'שם משתמש או אימייל')
            $("#at-field-password").attr('placeholder', 'סיסמא');
        },
        components: {
            AdminHome,
            UsersHome
        },
        computed: {
            ...mapState('globalStore', [
                'apploaded'
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