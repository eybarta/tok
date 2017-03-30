<template>
    <main>
    <transition name="fade">
        <transition-group  v-if="!started" class="welcome" name="fade-slide" tag="div">
            <div v-if="!goodluck" key="0">
                <h2 class="pb-big">יש לך 14 דקות לסיים.</h2>
                <button @click="starttest" class="btn btn-success btn-big">התחל</button>
                <router-link to="/" class="back-btn btn btn-warning">חזרה</router-link>
            </div>
            <h2 v-else class="primary" key="1"> בהצלחה !!</h2>
        </transition-group>
    </transition>
    <div class="countdown" v-text="countdown"></div>
    <div class="test-wrap">
        <div class="test">
            <h2 v-text="testTitle"></h2>
            
            <component :is="currentCategory"></component>
                <div @click="updateQuestionIndex('prev')" :class="['slide-btn', 'slide-prev', questionIndex==0?'disabled': '']"></div>
                <div @click="updateQuestionIndex('next')" :class="['slide-btn', 'slide-next', questionIndex==questions.length-1?'disabled': '']"></div>
            
        <div class="pager-progress ltr">
	        <ul>
                <li @click.prevent="updateQuestionIndex(index)" v-for="(question, index) in questions" :class="[!!question.chosenAnswer ? 'answered' : '', index==questionIndex ? 'active' : '']" >
                   <span>{{ index+1 }}</span>
                </li>
            </ul>
        </div>
        <div class="tcenter actions">
            <button class="center btn btn-success btn-big" @click="finish">סיימתי</button>
        </div>
        <div class="status">
            <h4>ענית עד כה על <span v-text="answeredSoFar"  :class="[!!answeredSoFar? '' : 'red']"></span><span>/{{ questions.length}}</span></h4>
        </div>
        </div>

        <div v-if="!!testinfo.score" class="popup">
            <div class="popup-content">
                <i class="lnr lnr-close"></i>
                <h4>הציון שלך:</h4>
                <div class="big score">{{ testinfo.score }} <span>/ 100</span></div>

                <router-link class="link" :to="{ name: 'user'}">חזרה לעמוד הבית</router-link>
            </div>
        </div>
    </div>
    </main>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { categories } from '/imports/api/categories'
import Series from './testTypes/Series.vue'
    export default {
        data() {
            return {
                started: false,
                goodluck: false,
                timer: 840000,
                questiontimer: null,
                idle: {
                    flag: false,
                    timer: 60000
                },
                testinfo: {
                    score: null,
                    meta: null, 
                    percentComplete: 0,
                    timeToComplete: 0,
                    averageTimeOnQuestion: 0,
                    questions: []
                },
            }
        },
        created() {
            console.log("active test created");
            this.testinfo.questions = this.questions;
            // this.countdownobj.start();
        },
        components: {
            Series
        },
        watch: {
            'questionIndex'() {
                this.timeQuestion(this.questionIndex)
            }
        },
        methods: {
            ...mapActions('testsModule', [
                'saveTestToUser',
                'updateQuestionIndex'
            ]),
            starttest() {
                let ref = this;
                this.updateQuestionIndex(0)
                this.$set(this, 'goodluck', true)
                Meteor.setTimeout(function() {
                    this.$set(this, 'started', true)
                    document.body.addEventListener('keyup', this.keyupHandler);
                    document.body.addEventListener('mousemove', this.mousemoveHandler);
                    Meteor.setInterval(function() {
                        this.$set(this, 'timer', this.timer-1000)
                        this.$set(this.idle, 'timer', this.idle.timer-1000)
                        if (this.idle.timer<=0) {
                            this.flagIdle();
                        }
                    }.bind(this),1000)
                    this.timeQuestion(0)
                }.bind(this), 1000)
                
            },
            keyupHandler(e) {
                console.log("key up handler < ", e.keyCode);
                (e.keyCode==37) 
                ?   this.updateQuestionIndex('prev')
                :   (e.keyCode==39)
                ?   this.updateQuestionIndex('next')  // right
                :   ''
                if (!!this.$set) {
                    this.$set(this.idle, 'timer', 60000)
                }
            },
            mousemoveHandler(e) {
                this.$set(this.idle, 'timer', 60000)
            },
            timeQuestion(index) {
                Meteor.clearInterval(this.questiontimer)
                let question = this.testinfo.questions[index];
                question.timer = question.timer || 0;
                this.questiontimer = Meteor.setInterval(function() {
                    question.timer++;
                }, 1000)
            },
            flagIdle() {
                console.log('User has been idle for 2 minutes')
            },
            getAverageTimeOnQuestion() {
                let answered = _.filter(this.questions, 'chosenAnswer');
                let sum = _.sumBy(_.map(answered, 'timer'));
                let averageInSeconds = sum / answered.length;
                return averageInSeconds;
                // return moment(averageInSeconds, 's').format('m:ss');
            },
            finish() {
                let correctAnswers = _.filter(this.questions, question => {
                    return question.chosenAnswer == question.answers.correct;
                })
                this.$set(this.testinfo, 'score', (correctAnswers.length/this.questions.length)*100);
                this.$set(this.testinfo, 'meta', this.route.params)
                this.$set(this.testinfo, 'percentComplete', (this.answeredSoFar/20)*100)
                this.$set(this.testinfo, 'timeToComplete', moment.duration(moment(840000).diff(this.timer)).asSeconds())
                this.$set(this.testinfo, 'averageTimeOnQuestion', this.getAverageTimeOnQuestion())
                console.log(correctAnswers.length, " questions were answered correctly");
                console.log((correctAnswers.length/this.questions.length)*100, " is your score");

                // Allow viewing of test with correct answers.
                this.saveTestToUser(this.testinfo)
            }
        },
        computed: {
            ...mapState('testsModule', [
                'testTypes',
                'questionIndex'
            ]),
            ...mapState([
                'route'
            ]),
            ...mapGetters('testsModule', [
                'currentCategory',
                'questions'
            ]),
            countdown() {
                return moment(this.timer).format('m:ss');

            },
            answeredSoFar() {
                return _.filter(this.questions, 'chosenAnswer').length
            },
            
            testTitle() {
                let params = this.route.params,
                    type = _.find(this.testTypes, {value: params.type}),
                    category = _.find(categories, { value: params.category});
                    test = _.find(category.children, { value: params.activetest})
                return type.label + " : " + category.label + " : " + test.label;
            }
        }
    }
</script>
<style lang="stylus" scoped>
@import '~imports/ui/styl/variables.styl'
@import '~imports/ui/styl/mixins'

.fade-slide
    transition all 400ms ease
.popup
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(0,0,0,0.7)
    z-index 99999999
.popup-content
    position absolute
    top 50%
    left 50%
    border-radius 150px
    width 300px
    height 300px
    border 5px solid rgba(#212121, 0.2)
    background #fff
    padding 5%
    transform translate(-50%,-50%)
    h4
        font-size 30px
    .score
        self-center()
        font-size 40px
        padding 5% 0
        text-align center
        color darken(bluegreen, 10)
        span
            font-size 20px
.green
    color green !important
.red
    color red !important

.list-item 
    display inline-block
    
.list-enter-active
    transition transform 1000ms, opacity 1000ms ease
.list-leave-active
    transition transform 500ms, opacity 500ms ease
.list-enter, .list-leave-to
    opacity 0
.list-enter
    transform translateX(-120%)
.list-leave-to
    transform translateX(120%)
.list-enter-to, .list-leave
    opacity 1
    transform translateX(0)
    


.test
    position absolute
    top 40%
    left 0
    transform translateY(-50%)
    height 50vh
    width 100%
    h2
        text-align center
        color lighten(darkblue, 10)
        padding 40px 0
        font-weight normal
    

                
.actions
    padding 30px 0          
.pager
    padding 30px 0
    width 100%
    text-align center
    a
        display inline-block
        margin 0 10px
        text-decoration none
        font-size 20px
        color lighten(darkblue, 5)
    .active a
        color darken(#f2a856, 10)
        
/* 
    PROGRESS -- Pager with progress markers
*/
.slide-btn
    position absolute
    top 0
    height 100%
    width 10%
    opacity 0.4
    cursor pointer
    transition opacity 400ms ease
    z-index 9
    &:hover
        opacity 0.9
    &:before
        content ''
        border-left 2px solid #c2c2c2
        border-top 2px solid #c2c2c2
        width 30%
        padding-top 30%
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%) rotate(-45deg)
    &.slide-prev
        left 0
    &.slide-next
        right 0
        &:before
            transform translate(-50%,-50%) rotate(135deg)
    &.disabled
        opacity 0.1
        pointer-events none
.pager-progress
    padding 3% 0 0
    ul
        text-align center
        li
            position relative
            display inline-block
            margin 0 0.5% 1.5%
            border 1px solid red
            border-left-color rgba(darken(#0bddbe, 20), 0.7)
            width 32px
            height 32px
            border-radius 20px
            cursor pointer
            transform rotate(-45deg)
            transition border 400ms ease, background 400ms ease, transform 200ms ease
            span
                self-center()
                display block
                color red
                font-size 12px
                transition color 400ms ease
                position relative
                transform translate(-50%,-50%) rotate(45deg)
            &:hover, &.active
                border-color rgba(darken(#0bddbe, 20), 0.7)
                transform rotate(-20deg)
                background rgba(#0bddbe, 0.05)
                span
                    color rgba(darken(#0bddbe, 20), 0.7)
                &:after
                    content ''
                    position absolute
                    height 7px
                    width 1px
                    background darken(#0bddbe, 40)
                    top 105%
                    left 50%
                    transform translateX(-50%)
            &.active
                transform rotate(-20deg) scale(1.5)
                margin 0 1% 1.5%
            &.answered
                border-color darken(#0bddbe, 15)
                background rgba(#0bddbe, 0.05)
                transform scale(0.82)
                margin 0 0.2% 1.5%
                span
                    transform translate(-50%,-50%) rotate(0deg)
                    color darken(#0bddbe, 15)
/*
    STATUS -- user's stats on current test.
*/
.status
    direction rtl
    text-align center
    padding 10% 0
    span
        direction ltr
        font-family 'Helvetica Thin'
        &:first-child
            color darken(#0bddbe, 10)

.countdown
    position absolute
    left 50%
    transform translate(-50%)
    top 10%
    color red
    font-size 6vmin
    letter-spacing 10px

.welcome
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(255,255,255,0.999)
    z-index 999
    text-align center
    overflow hidden
    & > div, & > h2
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
    .back-btn
        display block
        width 120px
        padding 10px 20px
        margin 40px auto
        
</style>