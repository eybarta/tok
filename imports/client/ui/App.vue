<template>
	<div :class="['app-wrap', lang]">
	<!--		<div class="logo"><span>Q</span>uizzzler</div>	-->
		<side-menu v-if="!!user"></side-menu>
		<router-view></router-view>

		<popup v-if="popup.active">
		</popup>

		<footer>
			<img src="/img/logo-etz.svg" alt="">
			<small>  &copy; כל הזכויות שמורות עץ הדעת 2017 </small>
		</footer>
	</div>
</template>
<script>
import SideMenu from './components/SideMenu.vue'
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
		this.initUsers();
		this.initFixedTests();
		this.initImagesCollection();
	},
    components: {
		SideMenu,
		Popup
    },
	methods: {
		...mapActions('usersModule', [
			'initUser',
			'initUsers'
			
		]),
		...mapActions('testsModule', [
			'initFixedTests',
			//temp
			'initImagesCollection'
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
@import '~imports/client/ui/styl/settings'
.app-wrap
	width 100%
	height 100%
	
</style>