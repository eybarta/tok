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
        }
    }
</script>
<style lang="stylus">
@import '~imports/ui/styl/variables.styl'
@import '~imports/ui/styl/mixins.styl'
@import '~imports/ui/styl/settings'

.side-menu
    // primary-corner(en)
    // /.heb &
    //     primary-corner(heb)
    position fixed
    top 0
    left 0
    width 30vw
    height 100vh
    border-right 1px solid bluegreen
    background #fff
    z-index 11
    transform translate(-100%, 0)
    transition transform 400ms ease
    .brand
        width 100%
        padding-top 100%
        background rgba(bluegreen, 0.5)
        position relative
        &:after
            content 'Q'
            font-family "Varela Round"
            color lighten(darkblue, 10)
            self-center()
            transition transform 400ms ease
            font-size 1280%
        &:hover:after
            transform translate(-50%,-50%) rotate(-22deg)


    .menu-toggler
        cursor pointer
        position absolute
        top 20px
        right -60px
        font-size 40px
        color darkgray
        transition color 400ms ease
    &.active
        transform translate(0, 0)
        box-shadow 2px 0px 4px rgba(0,0,0,0.05)
        .menu-toggler
            color bluegreen

</style>