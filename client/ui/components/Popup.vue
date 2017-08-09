<template>
<div class="popup-wrap" @click="popClickHandler($event)">
    <div class="popup-content">
        <i @click="closePopup" class="lnr lnr-cross topleft"></i>
        <h4 v-if="!!popup.title" v-text="popup.title"></h4>
        <component v-if="!!popup.type" :is="popup.type" :moredata="popup.data"></component>
        <div class="msg" v-else v-html="popup.data"></div>
    </div>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
// Available components

// Generic
// import GenericMessage from '/client/ui/components/'
// Admin
import AddUsers from '/client/ui/admin/forms/AddUsers.vue'

// User
import UserProfile from '/client/ui/user/forms/Profile.vue'
export default {
    components: {
        AddUsers,
        UserProfile
    },
    created() {
        $('body').on('keyup', this.popKeyupHandler)
    },
    methods: {
        ...mapActions('globalStore', [
            'closePopup'
        ]),
        popClickHandler(e) {
            console.log("E>>", e);
            if ($(e.target).parents(".popup-wrap").length<1) {
                this.closePopup();
            }
        },
        popKeyupHandler(e) {
            if (e.keyCode===27) {
                this.closePopup();
            }
        }
    },
    computed: {
        ...mapState('globalStore', [
            'popup'
        ])
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/mixins.styl'
.popup-wrap
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background rgba(0,0,0,0.7)
    z-index 200
    .popup-content
        self-center()
        padding 30px
        background #fff
        width 100vw
        min-height 65vh
        border-radius 7px
        height auto
        border 2px solid #0bddbe
        @media screen and (min-width: 600px)
            max-width 600px
            width 67vw
            min-height 45vh
        h4
            font-size 26px
        i
            cursor pointer
            color lighten(gray, 10)
            font-size 20px
</style>