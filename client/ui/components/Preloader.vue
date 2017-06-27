<template>
<div class="bgblank">
	<div class='preloader'>
        <img v-if="hasmounted" class="loader-icon spinning-cog" src="/img/cog.svg">
        <h5 v-text="pretitle"></h5>
	</div>
</div>
</template>
<script>
export default {
	props: ["pretitle"],
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
</style>