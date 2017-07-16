<template>
<div class="users-home">
    <div v-if="!!user && !route.meta.test" class="profile">
        <a class="profile-link" href="#p" title="לחץ לעדכון פרטים" @click.prevent="callPopup({ title:'פרטים אישיים', type:'UserProfile'})"><span v-text="user.profile.name"></span><i class="fa fa-user"></i></a>
        <a class="signout" href="#p" @click.prevent="signOutUser">התנתק</a>
    </div>
    <router-view></router-view>
    
</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
    export default {
        mounted() {
            let user = this.user;
            if (!!user && !user.profile.dirty) {
                this.callPopup({ title:'פרטים אישיים', type:'UserProfile'})
                this.dirtifyUser();
            }
            console.log("USER HOME>> route.meta", this.route.meta.test)
            if (!!user) {
                this.initFixedTests();
                this.initImagesCollection();
            }
        },
        computed: {
            ...mapState('usersModule', [
                'user',
                'users'
            ]),
            ...mapState([
                'route'
            ])
        },
        methods: {
            ...mapActions('globalStore', [
                'callPopup'
            ]),
            ...mapActions('usersModule', [
                'dirtifyUser',
                'signOutUser'
            ]),
            ...mapActions('testsModule', [
                'initFixedTests',
                //temp
                'initImagesCollection'
            ])
        }
    }
</script>
<style lang="stylus">
@import '~imports/styl/variables.styl'
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}

.users-home
    min-height 95vh
</style>