<template>
<div :class="[!!backdrop ? 'bgblank' : 'bg']">
	<div :class="['preloader', size]">
        <img v-if="hasmounted" class="loader-icon spinning-cog" src="/img/cog.svg">
        <h5 v-text="pretitle"></h5>
	</div>
</div>
</template>
<script>
export default {
	props: ["size", "backdrop", "pretitle"],
    data() {
        return {
            hasmounted: false
        }
    },
    mounted() {
        this.hasmounted = true;
    }
}
</script>
<style lang="stylus">
.bgblank
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background rgba(#fff, 0.88)
    z-index 108
.bg
    min-height 35vh
    position relative
.preloader
    position absolute
    width 210px
    height 210px
    &.tiny
        width 28px
        height @width
    top 50%
    left 50%
    transform translate(-50%,-50%) !important
    text-align center
    img
        opacity 0.2
        position relative
        width 100%
    h5
        color #bcbcbd
        line-height 1
        font-size 18px
        font-family 'HelveticaLT'
        text-align center
        padding-top 10px
        opacity 0.35
        margin 0
</style>