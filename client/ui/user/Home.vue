<template>
<div class="users-home">
    <div v-if="!!user" class="profile">
        <a class="profile-link" href="#p" title="לחץ לעדכון פרטים" @click.prevent="callPopup({ title:'פרטים אישיים', type:'UserProfile'})"><span v-text="user.profile.name"></span><i class="fa fa-user"></i></a>
        <a class="signout" href="#p" @click.prevent="signOutUser">התנתק</a>
    </div>
    <main>
        <router-view></router-view>
    </main>
    
</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Popup from '/client/ui/components/Popup.vue';
    export default {
        mounted() {
            let user = this.user;
            if (!!user && !user.profile.dirty) {
                this.callPopup({ title:'פרטים אישיים', type:'UserProfile'})
                this.dirtifyUser();
            }
        },
        computed: {
            ...mapState('usersModule', [
                'user',
                'users'
            ]),
        },
        methods: {
            ...mapActions('globalStore', [
                'callPopup'
            ]),
            ...mapActions('usersModule', [
                'dirtifyUser',
                'signOutUser'
            ]),
        },
        components: {
            Popup
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
</style>