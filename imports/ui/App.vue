<template>
	<div v-show="!!loggedIn" class="app-wrap">
        <h1>Quizzzler</h1>

        <!--<add-question></add-question>-->
		<series-test></series-test>
	</div>
</template>
<script>
import AddQuestion from './components/AddQuestion.vue'
import SeriesTest from './components/series/SeriesTest.vue'
export default {
	created() {
		console.log('app was created successfuly');
	},
    components: {
        AddQuestion,
		SeriesTest
    },
	methods: {
		
	},
	computed: {
		loggedIn() {
            return Accounts.userId()
        }
	}
}
</script>
<style lang="stylus">
.app-wrap
	width 100%
	height 100%
	/*background url('/img/background_hp.jpg') no-repeat 50% 0 / cover*/
</style>