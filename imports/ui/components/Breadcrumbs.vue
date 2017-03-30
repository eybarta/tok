<template>
    <ul class="breadcrumbs">
			<li>
                <router-link  :to="{ name: 'home'}">תרגול</router-link>
			</li>
			<li v-for="crumb in breadCrumbs">
				<router-link :to="{ name: menuName, params: crumb.params }"><span>></span> <span>{{ crumb.label }}</span></router-link>
			</li>
		</ul>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters('testsModule', [
            'breadCrumbs',
        ])
    }
}    
</script>
<style lang="stylus" scoped>
// .breadcrumbs
//     padding 0 0 0 2%
//     margin 0
//     list-style none
//     opacity 0.7
//     transition opacity 200ms ease
//     &:hover
//         opacity 1
//     li
//         display inline-block
//         margin-right 3px
//         a
//             height 100%
//             display inline-block
//             vertical-align middle
//             color #fff
//             font-size 14px
//             &:before
//                 content ''
//                 display inline-block
//                 height 100%
//                 vertical-align middle
//         span
//             display inline-block
//             vertical-align middle
//             line-height 1
//             &:first-child
//                 font-size 12px
//         &:last-child
//             a
//                 color #646d71
//                 cursor default
//                 pointer-events none
</style>