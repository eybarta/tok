<template>
	<div class='preloader'>
        <img class="loader-icon spinning-cog" src="/img/cog.svg">
        <h5 v-text="pretitle"></h5>
	</div>
</template>
<script>
export default {
	props: ["pretitle"]
}
</script>
<style lang="stylus">
.preloader
    position absolute
    width 210px
    top 50%
    left 50%
    transform translate(-50%,-50%) !important
    text-align center
    img
        opacity 0.2
        position relative
        transform scale(0.7)
    h5
        color #bcbcbd
        line-height 1
        font-size 18px
        font-family 'HelveticaLT'
        text-align center
        padding-top 10px
        opacity 0.35
        margin 0

// COG LOADER

.preloader .spinning-cog
    -webkit-animation spinning-cog 2s infinite ease
    -moz-animation spinning-cog 2s infinite ease
    -ms-animation spinning-cog 2s infinite ease
    -o-animation spinning-cog 2s infinite ease
    animation spinning-cog 2s infinite ease

@keyframes spinning-cog {
  0% { transform: rotate(0deg) }
  20% { transform: rotate(-45deg) }
  100% { transform: rotate(360deg) }
}

</style>