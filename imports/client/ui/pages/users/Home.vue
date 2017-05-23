<template>
<div class="users-home">
    <main>
        <router-view></router-view>
    </main>
    
</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Popup from '../../components/Popup.vue'
    export default {
        data() {
            return {
            }
        },
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

</style>