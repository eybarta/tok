<template>
<div class="popup-wrap">
    <div class="popup-content">
        <i @click="closePopup" class="lnr lnr-cross topleft"></i>
        <h4 v-if="!!popup.title" v-text="popup.title"></h4>
        <component :is="popup.type" :moredata="popup.data"></component>
    </div>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
// Available components
// Admin
import AddUsers from '/imports/ui/pages/admin/forms/AddUsers.vue'

// User
import UserProfile from '/imports/ui/pages/users/forms/Profile.vue'
export default {
    components: {
        AddUsers,
        UserProfile
    },
    methods: {
        ...mapActions([
            'closePopup'
        ])
    },
    computed: {
        ...mapState([
            'popup'
        ])
    }
}
</script>
<style lang="stylus">
@import '~imports/ui/styl/mixins.styl'
.popup-wrap
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background rgba(0,0,0,0.7)
    .popup-content
        self-center()
        padding 4%
        background #fff
        width 60vw
        min-height 45vh
        border-radius 7px
        height auto
        border 2px solid #0bddbe
        h4
            font-size 26px
        i
            cursor pointer
            color lighten(gray, 10)
            font-size 20px
</style>