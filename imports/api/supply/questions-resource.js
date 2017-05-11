import Vue from 'vue'
import { Supply } from 'vue-supply'
import VueMeteorTracker from 'vue-meteor-tracker';
import { Questions } from '../collections/questions'
import { mapState } from 'vuex'
if (Meteor.isClient) {
    Vue.use(VueMeteorTracker);


export default new Vue({
    extends: Supply,    
    data () {
        return {
            list: [],
            category: null
        }
    },
    created() {
        this.$set(this, 'category', _.last(document.location.pathname.split('/')))
    },
    // Realtime data from Meteor
    // special option provided by vue-meteor-tracker
    meteor: {
        list () {
            return Questions.find({})
        },
    },
//   // Automatic activation
    methods: {
        activate () {
            // Special method provided by vue-meteor-tracker
            this.questionList = this.$subscribe('questions', this.category)
        },
        deactivate () {
            // Special method provided by vue-meteor-tracker
            this.$stopHandle(this.questionList)
        }
  },
})
}
