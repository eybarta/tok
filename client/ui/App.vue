<template>
	<div :class="['app-wrap', lang]">

		<transition name="note-fly" appear mode="out-in">
			<note v-if="!!note.active"></note>
		</transition>
	<!--
		<side-menu v-if="!!user"></side-menu>
	-->
	   
   	 	<preloader v-if="(!apploaded || !!userloading) && !!appCompReady"></preloader>
		<router-view></router-view>

		<popup v-if="popup.active">
		</popup>

		<footer v-if="!!apploaded">
			<img src="/img/logo-etz.svg" alt="">
			<small>  &copy; כל הזכויות שמורות עץ הדעת 2017 </small>
		</footer>
	</div>
</template>
<script>
import SideMenu from './components/SideMenu.vue'
import Popup from './components/Popup.vue'
import { mapActions, mapState } from 'vuex'	
import Preloader from '/client/ui/components/Preloader.vue'
import Note from '/client/ui/components/Note.vue'
export default {
	data() {
		return {
			lang: 'heb',
			appCompReady: false
		}
	},
	created() {
		// console.log('app was created successfuly >> ', this.user);
		// this.initFixedTests();
		// this.initImagesCollection();
	},
	mounted() {
		console.log('app mounted');
		this.$nextTick(function() {
			this.appCompReady = true;
		})
	},
    components: {
		SideMenu,
		Popup,
		Preloader
    },
	methods: {
		// ...mapActions('usersModule', [
		// 	'initUser',
		// 	'initUsers'
			
		// ]),
		// ...mapActions('testsModule', [
		// 	'initFixedTests',
		// 	//temp
		// 	'initImagesCollection'
		// ])
	},
	computed: {
		...mapState('usersModule', [
			'user',
			'isAdmin',
			'userloading'
		]),
		...mapState('globalStore', [
			'popup',
			'apploaded',
			'note'
		])
	}
}
</script>
<style lang="stylus">
@import '~imports/styl/settings'
	

</style>