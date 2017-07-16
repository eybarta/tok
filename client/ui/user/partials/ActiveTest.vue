<template>
    <div class="active-test">
        <transition v-if="mode==='test'" name="fade">
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
        <div v-if="!!started && !!testQuestions && !!testQuestions.length" class="test-wrap">
            <div class="test">
                <h2 v-text="testTitle"></h2>
                <div :class="['countdown', !!idle.flag ? 'bigger' : '']" v-if="mode==='test' && withtimer">
                <!--
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 300 300" preserveAspectRatio="none" style="width:300; height:300; top:0; left:0;">
                        <circle ref="timerCircle" cx="100" cy="100" r="57" fill="none" stroke="#00CC33" stroke-width="1" stroke-dasharray="0,20000" transform="rotate(-90,100,100)" style="transition: stroke-dasharray 300ms cubic-bezier(0.125, 0.585, 0.22, 1.1)" />
                        <text v-text="countdown" text-anchor="middle" x="100" y="110" ></text>
                    </svg>
                -->
                    <radial-progress-bar :diameter="120"
                       :completed-steps="completedTimerSteps"
                       :total-steps="totalTimerSteps"
                       :start-color="calcStartcolor"
                       :end-color="calcEndColor"
                       >
                    </radial-progress-bar>
                    <div class="time-clock">
                        <span v-text="countdown"></span>
                        <!--
                        <i class="fa fa-clock-o"></i>
                        -->
                    </div>
                
                </div>
                <div class="question-container">
                    
                    <div :key="0" :class="['test-questions', 'ltr', !!questionImageUrl ? 'split-screen' : '']">
                        <component :mode="mode" :questionIndex="questionIndex" :questions="testQuestions" :is="currentCategory"></component>
                        <div @click="updateQuestionIndex('prev')" :class="['slide-btn', 'slide-prev', questionIndex==0?'disabled': '']"></div>
                        <div @click="updateQuestionIndex('next')" :class="['slide-btn', 'slide-next', questionIndex==testQuestions.length-1?'disabled': '']"></div>
                    </div>
                    <transition name="fade-left">
                    
                        <div :key="1" @click.stop="popImage=!popImage" v-if="!!questionImageUrl" class="question-image-container">
                                <img :src="questionImageUrl" alt="">
                        </div>
                    </transition>
                </div>
            <div class="pager-progress ltr">
                <ul>
                    <li @click.prevent="updateQuestionIndex(index)" v-for="(question, index) in testQuestions" 
                        :key="question"
                        :class="[
                            !!question.chosenAnswer 
                            ? (mode==='review' 
                                ? (question.chosenAnswer===question.answers.correct ? 'correct' : 'wrong') 
                                : 'answered')
                            : '', index==questionIndex ? 'active' : '']" >
                    <span>{{ index+1 }}</span>
                    </li>
                </ul>
            </div>
            <div v-if="mode==='test'" class="status">
                <h4>ענית עד כה על 
                    <span>
                        <span v-text="answeredSoFar"  :class="[!!answeredSoFar? '' : 'red']"></span>
                        <span>/{{ testQuestions.length}}</span>
                    </span>
                        
                </h4>
            </div>
            <div class="tcenter actions">
                <button :class="['mt-small', 'mb-small', 'center', 'btn', 'btn-big', mode==='test' ? 'btn-success' : 'btn-warning']" @click="finish" v-text="mode==='test' ? 'סיימתי' : 'יציאה'"></button>
            </div>
            </div>
            <div >
                <img @click.stop.prevent="popImage=false" :src="questionImageUrl" alt="" v-if="!!questionImageUrl && !!popImage" class="overlayed">
            </div>
            <div v-if="testinfo.score>-1 && mode!='review'" class="popup">
                <div class="popup-content">
                    <i class="lnr lnr-close"></i>
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
                            <div class="big num">{{ testinfo.regulatoryScore }}</div>
                        </div>
                        <div class="info">
                            <h5 class="label">זמן ממוצע לשאלה</h5>
                            <span>{{ formatAverageTimeOnQuestion }}</span>
                        </div>
                    </div>
                    <div class="links">
                        
                        <button class="btn btn-warning block center mb-small" @click="mode='review'">חזרה על המבחן</button>
                        <router-link to="/" class="back-btn btn btn-primary vmid" exact><span>חזרה לעמוד הבית </span><i class="fa fa-chevron-left mr-min"></i></router-link>
                    </div>
                    <div class="check-field">
                        <input id="historySave" v-model="testinfo.savedInHistory" checked="checked" type="checkbox"><label for="historySave">לשמור מבחן?</label>
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
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { categories } from '/imports/api/categories';
import RadialProgressBar from '/client/ui/components/RadialProgressBar.vue'
// Test Types
import Series from './testFormats/Series.vue'
import Hebrew from './testFormats/Hebrew.vue'
import Matrices from './testFormats/Matrices.vue'

const TOTAL_TEST_TIME = 840000;

export default {
    data() {
        return {
            withtimer: true,
            started: false,
            goodluck: false,
            totalTimerTime: TOTAL_TEST_TIME,
            timer: TOTAL_TEST_TIME,
            totalTimerSteps:60,
            questiontimer: null,
            questionIndex: 0,
            popImage: false,
            mode: 'test',
            idle: {
                int: 0,
                flag: false,
                timer: 60000
            },
            testinfo: {
                label: null,
                type: null,
                correct: null,
                wrong: null,
                unanswered: null,
                score: -1,
                regulatoryScore: null,
                meta: null, 
                percentComplete: 0,
                timeToComplete: 0,
                averageTimeOnQuestion: 0,
                questions: [],
                savedInHistory: true
            },
        }
    },
    // mixins: [use(QuestionList)],
    created() {
        if (this.$route.name==='testhistory') {
            this.$set(this, 'mode', 'review');
            this.$set(this, 'started', true)
        }
    },
    components: {
        Series,
        Hebrew,
        Matrices,
        RadialProgressBar
    },
    mounted() {
        this.fetchTestQuestions();
    },
    watch: {
        'questionIndex'() {
            this.timeQuestion(this.questionIndex)
        },
        'testQuestions'() {
            this.$set(this.testinfo, 'questions', this.testQuestions);
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
            this.updateQuestionIndex(0)
            this.$set(this, 'goodluck', true);
            Meteor.setTimeout(function() {
                this.$set(this, 'started', true);
                this.$nextTick(function () {
                    this.bindEvents();
                    this.idle.int = Meteor.setInterval(function () {
                        if (this.withtimer) {
                            if (this.timer<=0) {
                                this.finish();
                            }
                            else {
                                this.$set(this, 'timer', this.timer - 1000);
                            }
                            if (this.mode === 'test' && this.timer <= 0) {
                                Meteor.clearInterval(this.idle.int);
                                this.finish();
                            }
                        }
                        this.$set(this.idle, 'timer', this.idle.timer - 1000)
                        if (this.idle.timer <= 0) {
                            this.flagIdle();
                        }
                    }.bind(this), 1000)
                    this.timeQuestion(0)
                })
                    
            }.bind(this), 2000)
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
            Meteor.clearInterval(this.questiontimer)
            let question = this.testinfo.questions[index];
            question.timer = question.timer || 0;
            this.questiontimer = Meteor.setInterval(function() {
                question.timer++;
            }, 1000)
        },
        flagIdle() {
            console.log('User has been idle for 2 minutes');
            this.$set(this.idle, 'flag', true);
            $('body').on('mousemove', this.notIdle)
            $('body').on('keyup', this.notIdle)

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
            Meteor.clearInterval(this.idle.int);
            if (this.mode==='review') {
                this.$router.push({ path: '/' });
                return false;
            }
            let answered, correct, wrong;
            answered = _.filter(this.testQuestions, question => {
                return !!question.chosenAnswer;
            })
            correct = _.filter(answered, question => {
                return question.chosenAnswer == question.answers.correct;
            })
            this.$set(this.testinfo, 'type', this.$route.params.format);
            this.$set(this.testinfo, 'correct', correct.length);
            this.$set(this.testinfo, 'wrong', answered.length-correct.length);
            this.$set(this.testinfo, 'unanswered', this.testQuestions.length-answered.length);
            this.$set(this.testinfo, 'score', Math.round((correct.length/this.testQuestions.length)*100));
            this.$set(this.testinfo, 'regulatoryScore',Math.max(1, ((correct.length-this.testinfo.wrong)/this.testQuestions.length)*8+1).toFixed(1));
            this.$set(this.testinfo, 'percentComplete', (this.answeredSoFar/20)*100)
            this.$set(this.testinfo, 'timeToComplete', moment.duration(moment(840000).diff(this.timer)).asSeconds())
            this.$set(this.testinfo, 'averageTimeOnQuestion', this.getAverageTimeOnQuestion())
            this.$set(this.testinfo, 'meta', this.route.params)
            this.$set(this.testinfo.meta, 'date', moment().format("D/M/YYYY"))
            this.$set(this.testinfo, 'label', this.testTitle + ' ' + this.testinfo.meta.date);
            // this.$set(this.testinfo, 'savedInHistory', this.testinfo.savedInHistory)
            
            console.log(correct.length, " questions were answered correctly");
            console.log((correct.length/this.testQuestions.length)*100, " is your score");

            // Allow viewing of test with correct answers.
            this.saveTestToUser(this.testinfo)
        },
    },
    computed: {
        ...mapState('testsModule', [
            'testFormats',
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
            'currentCategory'
        ]),
        calcStartcolor() {
            return this.completedTimerSteps > this.totalTimerSteps/2 ? "#ea6b6b" : "#ea6b6b";
        },
        calcEndColor() {
            return this.completedTimerSteps > this.totalTimerSteps/2 ? "#ea6b6b" : "#ea6b6b";
        },
        completedTimerSteps() {
            let stepIntervals = this.totalTimerTime/60;
            return Math.round((this.totalTimerTime-this.timer)/stepIntervals);
        },
        questionImageUrl() {
            let q = this.testQuestions[this.questionIndex];
            console.log("QQQQ > ", q);
            return q.imageUrl;
        },
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
            type = _.find(this.testFormats, {value: this.route.name});
            if (!!params.category) {
                console.log(" >> ", params.category);
                category = _.find(categories, { value: params.category });
                name = _.find(category.children, { value: params.name})
            }
            console.log("tst title, category", category, name, type);
            if (!!type && !!type.label && !!category && !!category.label)
                return type.label + (!!category ? " ב" + category.label : '');
            else
                return 'מבחן';
            // return type.label + " : " + !!params.category ? category.label + " : " + name.label : '';
        }
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/variables.styl'
@import '~imports/styl/mixins'

correct-color = darken(bluegreen, 5)
wrong-color = lighten(red, 5);


.btn.disabled
    pointer-events none
    opacity 0.5

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
    overflow hidden
    @media screen and (max-height:680px)
        width 85vmin
        height @width
        border-radius unit(@width/2, 'vmin')
    h4
        font-size 30px
        text-align center
        @media screen and (max-height:680px)
            font-size 24px    
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
        @media screen and (max-height:680px)
            padding 0 0 2%
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
    .check-field
        position absolute
        bottom 5vmin
        left 50%
        transform translate(-50%,0)
        & > *
            display inline-block
            vertical-align middle
            &#historySave
                margin-left 5px

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
    transition width 200ms linear
    h4
        padding 5vh 0 0
        font-size 25px
        letter-spacing 1px
        direction rtl
        text-align center
    & > div > ul
        width 100%
        word-spacing 0
        white-space nowrap
        position relative
        transition transform 400ms ease
        & > li
            position relative
            display inline-block
            width 100%
            vertical-align top
            padding 5vh 8vw
            margin 0
            @media screen and (max-width:740px)
                padding-left 8%
                padding-right 8%
            .question
                text-align center
                h4
                    padding 0 0 2%
                    font-size 25px
                    letter-spacing 1px
                    direction rtl
                    text-align center
                .parts
                    padding 2% 0
                    border-top 1px dashed rgba(darken(#0bddbe, 60), 0.2)
                    border-bottom 1px dashed rgba(darken(#0bddbe, 60), 0.4)
                    span
                        display inline-block
                        margin 0 3.5vw
                        font-size 22px
                        font-family 'Helvetica Thin'
                        @media screen and (max-width:740px)
                            // margin 0 30px
                            font-size 22px
                        &.next
                            border-radius 4px
                            border 1px solid lighten(red, 15)
                            height 45px
                            line-height 45px
                            color lighten(red, 15)
                            min-width 60px
                            text-align center
                            &.success
                                font-family 'Helvetica Md'
                                line-height 50px
                                border 1px solid darken(bluegreen, 5)
                                background rgba(bluegreen, 0.1)
                                color darken(bluegreen, 5)
                                
                                
                                
        .answer
            text-align center
            padding 5vh 0 0
            h5
                padding-bottom 20px
            li
                display inline-block
                margin 0 2.2%
                a
                    font-family 'Helvetica Thin'
                    display inline-block
                    padding 10px
                    border-radius 9px
                    box-sizing border-box
                    text-decoration none
                    color lighten(darkblue, 20)
                    font-size 40px
                    border 1px solid transparent
                    background transparent
                    transition border 400ms ease, background 400ms ease, color 400ms ease
                    @media screen and (max-width:740px)
                        font-size 22px
                    &:hover
                        border 1px solid lighten(#0bddbe, 25)
                        color darken(#0bddbe, 10)
                    &.chosen
                        border 1px solid darken(#0bddbe, 5)
                        background rgba(#0bddbe, 0.02)
                        color darken(#0bddbe, 5)
                        & + span
                            color darken(#0bddbe, 5)
                    &.correct
                        border 1px solid correct-color
                        background rgba(correct-color, 0.01)
                        color correct-color
                        & + span
                            color correct-color
                    &.wrong
                        border 1px solid wrong-color
                        background rgba(wrong-color, 0.01)
                        color wrong-color
                        & + span
                            color wrong-color
                
.test
    min-height 50vh
    width 100%
    padding-bottom 75px
    background rgba(lighten(bluegreen, 45), 0.04)
    h2
        text-align center
        text-decoration underline
        height 14vh
        line-height 14vh
        color darken(bluegreen, 7)
        font-weight normal
        font-size 28px

        
/* 
    PROGRESS -- Pager with progress markers
*/
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
    padding 2vh 6vw
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
            &.correct
                border 1px solid bluegreen !important
                background-color rgba(bluegreen, 0.03)
                span
                    color bluegreen !important
            &.wrong
                border 1px solid red !important
                background-color lighten(red, 55)
                &:after
                    background darken(red, 20)
                span
                    color red !important
                
                
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
    padding 0
    span
        text-align left
        display inline-block
        direction ltr
        font-family 'Helvetica Thin'
        :first-child
            color darken(#0bddbe, 10)

.countdown
    color red
    position absolute
    top 1vh
    left 1vh
    text-align center
    font-size 3vmin
    z-index 103
    // transform scale(0.8)
    transition font-size 400ms ease
    .time-clock
        position absolute
        self-center()
        font-size 22px
        font-family 'Helvetica Thin'
    &.bigger
       font-size 6vmin
       z-index 105
       .radial-progress-container
            opacity 0
    span 
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
    z-index 104
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
        @media screen and (max-height:680px)
            width 40px
            height @width
            border-radius unit(@width/2, 'px')
        span
            position absolute
            top 105%
            left 50%
            transform translateX(-50%)
            font-size 16px
            width 100%
            @media screen and (max-height:680px)
                font-size 12px
            &.num
                top 50%
                transform translate(-50%,-50%)
                font-size 30px
                @media screen and (max-height:680px)
                    font-size 16px
        &:before
            content ''
            height 100%
            display inline-block
            vertical-align middle
.question-container
    word-spacing 0
    letter-spacing -5px
    position relative
    z-index 104
    background rgba(#fff, 0.7)
    & > *
        word-spacing initial
        letter-spacing initial
.split-screen
    width 50%
    mid(top)
.question-image-container
    transition all 300ms ease-out
    overflow hidden
    width 50%
    border-top 1px solid bluegreen
    border-right 1px dotted bluegreen
    mid(top)   
    padding-bottom 5%
    img
        position relative
        width 100%
.overlayed
    background rgba(0,0,0,0.7);
    padding 4px 4px 4px 0
    position absolute
    border-radius 0 6px 6px 0
    top 50%
    left 0
    text-align center
    transform translateY(-50%)
    z-index 105


.fade-enter-active, .fade-leave-active
    transition all .5s
    transform scale(1) rotate(0)
.fade-enter, .fade-leave-to
    opacity 0
    transform scale(4) rotate(-720deg)

.fade-left-enter
    transition all 200ms linear
    position absolute
    left 0
    width 10%
    transform translateX(-100%)
.fade-left-enter-to
    position relative
    width 50%
    transform translateX(0)
.fade-left-leave
    position absolute
    transition all 200ms linear
    width 50%
    transform translateX(0)
.fade-left-leave-to
    position absolute
    left -100%
    width 1%
    transform translateX(-100%)
    
</style>