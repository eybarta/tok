<template>
<div class="users-home">
    <main>
    <a class="profile-link" href="#p" title="לחץ לעדכון פרטים" @click.prevent="callPopup({ title:'פרטים אישיים', type:'UserProfile'})"><span v-text="user.profile.name"></span><i class="fa fa-user"></i></a>
        <router-view></router-view>
    </main>
    
</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Popup from '/imports/client/ui/components/Popup.vue';
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
                'dirtifyUser'
            ]),
        },
        components: {
            Popup
        }
    }
</script>
<style lang="stylus">
@import '~imports/client/ui/styl/variables.styl'
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

.profile-link
    color lighten(red, 15)
    position absolute
    left 30px
    top 20px
    padding-bottom 2px
    border-bottom 1px dotted lighten(red, 15)
    transition color 300ms ease, border 300ms ease
    &:hover
        color red
        border-color red
    i
        margin-right 5px

</style>