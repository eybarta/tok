<template>
    <main>
    <transition name="fade">
        <transition-group  v-if="!started" class="welcome" name="fade-slide" tag="div">
            <div v-if="!goodluck" key="0">
                <h2 class="pb-big" v-text="'מולך מבחן 20 שאלות ב' + categoryName"></h2>
                <!--
                <h2 class="pb-big">יש לך 14 דקות לסיים.</h2>
                -->
                <div class="radio-group">
                    <h4>האם תרצה לתרגל על זמן?</h4>
                    <div class="radio">
                        <label for="yes">   
                            <input hidden type="radio" name="timedtest" id="yes" :value="true" v-model="withtimer">
                            <span class="yes">כן</span>
                        </label>
                    </div>
                    <div class="radio">
                        <label for="no">
                        <input hidden type="radio" name="timedtest" id="no" :value="false" v-model="withtimer">
                            <span class="no">לא</span>
                        </label>
                    </div>
                </div>
                <button @click="starttest" :class="['btn', 'btn-success', 'btn-big', !!testQuestions && !!testQuestions.length ? '' : 'disabled']">התחל</button>
                <router-link to="/" class="back-btn btn btn-primary" exact>חזרה <i class="fa fa-chevron-left"></i></router-link>
            </div>
            <h2 v-else class="primary" key="1"> בהצלחה !!</h2>
        </transition-group>
    </transition>
    <div class="countdown" v-if="withtimer" v-text="countdown"></div>
    <div v-if="!!started && !!testQuestions && !!testQuestions.length" class="test-wrap">
        <div class="test">
            <h2 v-text="testTitle"></h2>
            <div class="test-questions ltr">
                <component :questionIndex="questionIndex" :questions="testQuestions" :is="currentCategory"></component>
                <div @click="updateQuestionIndex('prev')" :class="['slide-btn', 'slide-prev', questionIndex==0?'disabled': '']"></div>
                <div @click="updateQuestionIndex('next')" :class="['slide-btn', 'slide-next', questionIndex==testQuestions.length-1?'disabled': '']"></div>
            </div>
            
        <div class="pager-progress ltr">
	        <ul>
                <li @click.prevent="updateQuestionIndex(index)" v-for="(question, index) in testQuestions" :class="[!!question.chosenAnswer ? 'answered' : '', index==questionIndex ? 'active' : '']" >
                   <span>{{ index+1 }}</span>
                </li>
            </ul>
        </div>
        <div class="tcenter actions">
            <button class="center btn btn-success btn-big" @click="finish">סיימתי</button>
        </div>
        <div class="status">
            <h4>ענית עד כה על 
                <span>
                    <span v-text="answeredSoFar"  :class="[!!answeredSoFar? '' : 'red']"></span>
                    <span>/{{ testQuestions.length}}</span>
                </span>
                    
            </h4>
        </div>
        </div>

        <div v-if="!!testinfo.score" class="popup">
            <div class="popup-content">
                <i class="lnr lnr-close"></i>
                <!--
                <ul>
                    <li>
                        <span class="label">ציון</span>
                        <div class="big score">{{ testinfo.score }} <span>/ 100</span></div>
                    </li>

                </ul>
                -->
                <div class="review">
                    <div class="ltr score">
                        <h5 class="label">ציון יחיד</h5>
                        <div class="ltr singlescore">{{ testinfo.score }} <span>/ 100</span></div>
                    </div>
                    <h5>סיכום תשובות</h5>
                    <div class="review-bubble success">
                        <span class="num">{{ testinfo.correct}}</span>
                        <span>נכונות</span>
                    </div>
                    <div class="review-bubble danger">
                        <span class="num">
                            {{ testinfo.wrong}}
                        </span>
                        <span>שגיאות</span>
                    </div>
                    <div class="review-bubble info">
                        <span class="num">
                            {{ testinfo.unanswered}}
                        </span>
                        <span>לא נענו</span>
                    </div>
                   
                </div>
                <div class="centerize">
                    <div class="regscore">
                        <h4>ציון תקן</h4>
                        <div class="big num">{{ testinfo.regulatoryScore }} <span>/ 100</span></div>
                    </div>
                    <div class="info">
                        <h5 class="label">זמן ממוצע לשאלה</h5>
                        <span>{{ formatAverageTimeOnQuestion }}</span>
                    </div>
                </div>
                <div class="links">
                    <router-link to="/" class="back-btn btn btn-primary" exact>חזרה לעמוד הבית <i class="fa fa-chevron-left"></i></router-link>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div v-if="!!idle.flag" class="modal idle-modal">
                <div class="inner">
                    <h4>הלו תעורר!</h4>
                </div>
            </div>
        </transition>
    </div>
    </main>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { categories } from '/imports/api/categories'

// Test Types
import Series from './testTypes/Series.vue'
import Hebrew from './testTypes/Hebrew.vue'
export default {
    data() {
        return {
            withtimer: true,
            started: false,
            goodluck: false,
            timer: 840000,
            questiontimer: null,
            questionIndex: 0,
            idle: {
                flag: false,
                timer: 60000
            },
            testinfo: {
                type: null,
                correct: null,
                wrong: null,
                unanswered: null,
                score: null,
                regulatoryScore: null,
                meta: null, 
                percentComplete: 0,
                timeToComplete: 0,
                averageTimeOnQuestion: 0,
                questions: []
            },
        }
    },
    // mixins: [use(QuestionList)],
    // created() {
    //     console.log("USER >> ", this.user);
    //     // this.countdownobj.start();
    //     console.log("questionList >>", this.testQuestions);
    // },
    components: {
        Series,
        Hebrew
    },
    mounted() {
        this.fetchTestQuestions();
    },
    watch: {
        'questionIndex'() {
            console.log('qindex watch %%%%%%%');
            this.timeQuestion(this.questionIndex)
        },
        'testQuestions'() {
            console.log('1 tquestion watch %%%%%%%');
            this.$set(this.testinfo, 'questions', this.testQuestions);
            console.log('2 tquestion watch %%%%%%%');
            
        }
    },
    methods: {
        ...mapActions('testsModule', [
            'saveTestToUser',
            'fetchTestQuestions'
        ]),
        updateQuestionIndex(to) {
            let index = this.questionIndex,
            questionsAmount = this.testQuestions.length-1
            if (to=='next') {
                index != questionsAmount ? index++ : index=0
            }
            else if (to=='prev') {
                index != 0 ? index-- : index=questionsAmount
            }
            else {
                index = to;
            }
            this.$set(this, 'questionIndex', index);
        },
        starttest() {
            let ref = this;
            this.updateQuestionIndex(0)
            this.$set(this, 'goodluck', true);

            this.$nextTick(function() {
                console.log("testinfo >> ", this.testinfo);      
                Meteor.setTimeout(function() {
                    this.$set(this, 'started', true);
                    this.bindEvents();
                    
                    Meteor.setInterval(function() {
                        if (this.withtimer) {
                            this.$set(this, 'timer', this.timer-1000)
                        }
                        this.$set(this.idle, 'timer', this.idle.timer-1000)
                        if (this.idle.timer<=0) {
                            this.flagIdle();
                        }
                    }.bind(this),1000)
                    this.timeQuestion(0)
                }.bind(this), 1000)
            })
            
        },
        bindEvents() {
                console.log("BIND EVENTS");
                $(document.body).off('keyup mousemove')
                $(document.body).on('keyup', this.keyupHandler)
                $(document.body).on('mousemove', this.notIdle)
        },
        keyupHandler(e) {
            console.log("key up handler < ", e.keyCode);
            (e.keyCode==37) 
            ?   this.updateQuestionIndex('prev')
            :   (e.keyCode==39)
            ?   this.updateQuestionIndex('next')  // right
            :   ''
            this.notIdle();
        },
        notIdle() {
            if (!!this.$set) {
                this.$set(this.idle, 'timer', 60000)
                this.$set(this.idle, 'flag', false)
            }
        },
        timeQuestion(index) {
            console.log('1 index', index);
            console.log('1 this.questiontimer', this.questiontimer);
            Meteor.clearInterval(this.questiontimer)
            console.log('2 this.questiontimer', this.questiontimer);
            
            console.log('2 question', this.testinfo.questions);
            
            let question = this.testinfo.questions[index];
            console.log('3 this.questiontimer', question);
            
            question.timer = question.timer || 0;
            this.questiontimer = Meteor.setInterval(function() {
                question.timer++;
            }, 1000)
        },
        flagIdle() {
            console.log('User has been idle for 2 minutes');
            this.$set(this.idle, 'flag', true);
            $('body').on('mousemove', this.notIdle)
            $('body').on('keyuo', this.notIdle)

        },
        timedQuestions() {
            return _.filter(this.testQuestions, 'timer');
        },
        totalTime() {
            return _.sumBy(_.map(this.timedQuestions(), 'timer'));;
        },
        getAverageTimeOnQuestion() {
            let sum = this.totalTime();
            let timedQuestions = this.timedQuestions();
            let averageInSeconds = sum / timedQuestions.length;
            return Math.round(averageInSeconds);
        },
        finish() {
            let answered, correct, wrong;
            answered = _.filter(this.testQuestions, question => {
                return !!question.chosenAnswer;
            })
            correct = _.filter(answered, question => {
                return question.chosenAnswer == question.answers.correct;
            })
            this.$set(this.testinfo, 'type', this.$route.params.type);
            this.$set(this.testinfo, 'correct', correct.length);
            this.$set(this.testinfo, 'wrong', answered.length-correct.length);
            this.$set(this.testinfo, 'unanswered', this.testQuestions.length-answered.length);
            this.$set(this.testinfo, 'score', Math.round((correct.length/this.testQuestions.length)*100));
            this.$set(this.testinfo, 'regulatoryScore',Math.round(((correct.length-(this.testinfo.wrong/3))/20)*100));
            this.$set(this.testinfo, 'meta', this.route.params)
            this.$set(this.testinfo, 'percentComplete', (this.answeredSoFar/20)*100)
            this.$set(this.testinfo, 'timeToComplete', moment.duration(moment(840000).diff(this.timer)).asSeconds())
            this.$set(this.testinfo, 'averageTimeOnQuestion', this.getAverageTimeOnQuestion())
            console.log(correct.length, " questions were answered correctly");
            console.log((correct.length/this.testQuestions.length)*100, " is your score");

            // Allow viewing of test with correct answers.
            this.saveTestToUser(this.testinfo)
        },
    },
    computed: {
        ...mapState('testsModule', [
            'testTypes',
            'fixedtests',
            'testQuestions'
        ]),
        ...mapState('usersModule', [
            'user'
        ]),
        ...mapState([
            'route',
        ]),
        ...mapGetters('testsModule', [
            'currentCategory',
            'activeCategory'
        ]),
        countdown() {
            return moment(this.timer).format('m:ss');
        },
        formatAverageTimeOnQuestion() {
            let ref = this;
            return moment.duration(ref.testinfo.averageTimeOnQuestion, 'seconds').format('m:ss', {trim:false})
        },
        answeredSoFar() {
            let questions = this.testQuestions;
            console.log('answered>> ', _.filter(questions, 'chosenAnswer').length);
            return _.filter(questions, 'chosenAnswer').length
        },
        categoryName() {
            let params = this.route.params;
            let name = params.category || params.name;
            console.log("name > ", name);
            return _.find(categories, { value: name}).label;
        },
        testTitle() {
            console.log("params >>", this.route.params)
            let params, type, category, name;
            
            params = this.route.params;
            type = _.find(this.testTypes, {value: this.route.name});
            if (!!params.category) {
                console.log(" >> ", params.category);
                category = _.find(categories, { value: params.category });
                name = _.find(category.children, { value: params.name})
            }
            console.log(type.label);
            return type.label;
            // return type.label + " : " + !!params.category ? category.label + " : " + name.label : '';
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~imports/ui/styl/variables.styl'
@import '~imports/ui/styl/mixins'

.btn.disabled
    pointer-events none
    opacity 0.5
.fade-enter-active, .fade-leave-active {
  transition: all .5s
  transform: scale(1) rotate(0)
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
  transform: scale(4) rotate(-720deg)
}
.popup
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(0,0,0,0.96)
    z-index 99999999
.popup-content
    position absolute
    top 50%
    left 50%
    border-radius 34vmin
    width 68vmin
    height 68vmin
    border 5px solid rgba(#212121, 0.2)
    background #fff
    padding 5vmin
    transform translate(-50%,-50%)
    h4
        font-size 30px
        text-align center
    .centerize
        self-center()
        width 100%
        .info
            padding-top 15px
            text-align center
            .label
                display inline-block
                padding-left 5px
            span
                color gray

        .regscore
            padding 4% 0
            border-top 1px dotted bluegreen
            border-bottom 1px dotted bluegreen
            text-align center
        h4
            padding-bottom 2%
        .num
            color darken(bluegreen, 10)
            direction ltr
            font-size 4vmin
            span
                font-size 2vmin
    .score
        padding 0 0 4%
        .singlescore
            border-top 1px dotted bluegreen
            border-bottom 1px dotted bluegreen
            padding 5px 0
            width 20%
            margin 0 auto
        .label
            display inline-block
            padding-bottom 5px
    .links
        position absolute
        bottom 10vmin
        left 50%
        transform translateX(-50%)
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
    

.test-questions
    position relative
    overflow hidden
    padding 0 
    margin 0
    width 100%
    border-top 1px solid #0bddbe
    border-bottom 1px solid #0bddbe

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
            border 1px solid lighten(gray, 60)
            border-left-color rgba(darken(#0bddbe, 20), 0.5)
            width 32px
            height 32px
            border-radius 20px
            cursor pointer
            backface-visibility hidden
            -webkit-backface-visibility hidden
            -webkit-transform translate3d(0,0,0);
            transform translateZ(0)
            transform rotate(-45deg)
            transition border 400ms ease, background 400ms ease, transform 400ms ease
            span
                self-center()
                display block
                color darken(gray, 5)
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
                    background darken(#f3fefc, 60)
                    top 103%
                    left 50%
                    transform translateX(-50%)
            &.active
                transform rotate(-20deg) scale(2)
                background #f3fefc
                z-index 9
                
                
            &.answered
                border-color darken(#0bddbe, 15)
                background rgba(#0bddbe, 0.05)
                transform rotate(360deg) scale(1.20)
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
        text-align left
        display inline-block
        direction ltr
        font-family 'Helvetica Thin'
        :first-child
            color darken(#0bddbe, 10)

.countdown
    position absolute
    left 50%
    transform translate(-50%)
    top 10%
    color red
    font-size 6vmin
    letter-spacing 10px
    @media screen and (max-width:740px)
        top 15%
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
        min-width 65%
    .back-btn
        display block
        width 120px
        padding 10px 20px
        margin 40px auto
        i
            vertical-align middle
            display inline-block
            padding-right 8px
.radio-group
    padding 20px 0 50px
    h4
        padding-bottom 40px
        font-size 26px
    .radio
        display inline-block
        vertical-align middle
        padding 0 1vmin        
        label
            font-size 18px
            cursor pointer
            span
                position relative
                display inline-block
                border 1px solid gray
                width 5vmin
                height @width
                text-align center
                border-radius @width
                line-height @width
                transition border 300ms ease-out, color 300ms ease-out
                &:after
                    content ''
                    width 0
                    border-bottom 1px solid #000
                    position absolute
                    bottom -10px
                    left 50%
                    transform translateX(-50%)
                    transition width 200ms ease
                &:hover:after
                    width 20%
            input:checked + span.yes
                border-color darken(bluegreen, 18)
                color darken(bluegreen, 18)
                &:after
                    width 100%
                    border-color darken(bluegreen, 18)
            input:checked + span.no
                border-color red
                color red
                &:after
                    width 100%
                    border-color red
                
.modal
    background rgba(#fff, 0.98)
    position fixed
    top 0
    left 0
    right 0
    bottom 0 
    .inner
        self-center()
        h4
            color danger

.review
    padding 0 0 30px
    text-align center
    h5
        padding-bottom 10px 
        font-size 18px
    .review-bubble
        position relative
        display inline-block
        margin 0 5px
        width 60px
        height 60px
        border 1px solid gray
        border-radius 30px
        text-align center
        border-color inherit
        span
            position absolute
            top 105%
            left 50%
            transform translateX(-50%)
            font-size 16px
            width 100%
            &.num
                top 50%
                transform translate(-50%,-50%)
                font-size 30px
        &:before
            content ''
            height 100%
            display inline-block
            vertical-align middle
        
</style>