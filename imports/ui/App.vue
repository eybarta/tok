<template>
	<div :class="['app-wrap', lang]">
		<div class="logo"><span>Q</span>uizzzler</div>
		<side-menu v-if="!!user"></side-menu>
        <!--<add-question></add-question>-->
		<!--<series-test></series-test>-->
		<router-view></router-view>

		<popup v-if="popup.active">
			<!--<component  :is="popup.type"></component>-->
		</popup>

		<footer>
			<small>  &copy; כל הזכויות שמורות עץ הדעת 2017 </small>
		</footer>
	</div>
</template>
<script>
import SideMenu from './components/SideMenu.vue'
// import AddQuestion from './components/AddQuestion.vue'
// import SeriesTest from './components/series/SeriesTest.vue'
import Popup from './components/Popup.vue'
import { mapActions, mapState } from 'vuex'	

export default {
	data() {
		return {
			lang: 'heb'
		}
	},
	created() {
		console.log('app was created successfuly');
		// this.initUser();
		this.initUsers();
	},
    components: {
		SideMenu,
        // AddQuestion,
		// SeriesTest,
		Popup
    },
	methods: {
		...mapActions('usersModule', [
			'initUser',
			'initUsers'
			
		])
	},
	computed: {
		...mapState('usersModule', [
			'user',
		]),
		...mapState('globalStore', [
			'popup',
		])
	}
}
</script>
<style lang="stylus">
@import '~imports/ui/styl/settings'
.app-wrap
	width 100%
	height 100%
	/*background url('/img/background_hp.jpg') no-repeat 50% 0 / cover*/
	
</style>