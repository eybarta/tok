<template>
    <div :class="['side-menu', menuActive ? 'active' : '']">
        <i @click="menuActive=!menuActive" class="menu-toggler lnr lnr-menu"></i>

        <div class="brand">
        
        </div>
        <div class="profile" v-blaze="'profile'"></div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                menuActive: false
            }
        },
        
    }
</script>
<style lang="stylus">
@import '~imports/client/ui/styl/variables.styl'
@import '~imports/client/ui/styl/mixins.styl'
@import '~imports/client/ui/styl/settings'

.side-menu
    // primary-corner(en)
    // /.heb &
    //     primary-corner(heb)
    position fixed
    top 0
    right 0
    width 30vw
    height 100vh
    max-width 300px
    border-left 1px solid bluegreen
    background #fff
    z-index 11
    transform translate(100%, 0)
    transition transform 400ms ease
    .brand
        width 100%
        padding-top 100%
        background rgba(bluegreen, 0.5)
        position relative
        &:after
            self-center()
            content url(/img/logo-etz-fff.svg)
            width 40%
            opacity 0.7


    .menu-toggler
        cursor pointer
        position absolute
        top 20px
        left -60px
        font-size 40px
        color darkgray
        transition color 400ms ease
    &.active
        transform translate(0, 0)
        box-shadow 2px 0px 4px rgba(0,0,0,0.05)
        .menu-toggler
            color bluegreen

</style>