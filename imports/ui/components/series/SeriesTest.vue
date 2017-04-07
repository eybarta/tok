<template>
    <div class="series-wrap">
        <div class="series-test">
            <h2>מבחן סדרות</h2>
            <div class="test-questions">
                <div @click="prevSlide" :class="['slide-btn', 'slide-prev', currentQuestionIndex==0?'disabled': '']"></div>
                <div @click="nextSlide" :class="['slide-btn', 'slide-next', currentQuestionIndex==questions.length-1?'disabled': '']"></div>
                <ul :style="sliderTransform">
                    <li v-for="(question, index) in questions" :key="question.answers.correct" :data-index="index" class="list-item">
                        <div class="question">
                            <h4>מה הספרה הבאה בסדרה?</h4>
                            <div class="parts">
                                <span v-for="part in question.parts">{{ part }}</span>
                                <span class="next">?</span>
                            </div>
                        </div>
                        <div class="answer">
                            <ul>
                                <li v-for="answer in question.answers.list">
                                    <a href="#p"  @click.prevent="question.chosenAnswer=answer" :class="[question.chosenAnswer==answer ? 'chosen' : '']" v-text="answer"></a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        <div class="pager-progress">
	        <ul>
                <li @click.prevent="currentQuestionIndex=index" v-for="(question, index) in questions" :class="[!!question.chosenAnswer ? 'answered' : '', index==currentQuestionIndex ? 'active' : '']" >
                   <span>{{ index+1 }}</span>
                </li>
            </ul>
        </div>
        <div class="tcenter actions">
            <button class="center btn btn-success btn-big" @click="calculateScore">סיימתי</button>
        </div>
        <div class="status">
            <h4>ענית עד כה על <span v-text="answeredSoFar"  :class="[!!answeredSoFar? '' : 'red']"></span><span>/{{ questions.length}}</span></h4>
        </div>
        </div>

        <div v-if="!!score" class="popup">
            <div class="popup-content">
                <i class="lnr lnr-close"></i>
                <h4>הציון שלך:</h4>
                <div class="big score">{{ score }} <span>/ 100</span></div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                testinfo: {
                    userId: Accounts.userId(),
                    questions: []
                },
                score: null
            }
        },
        created() {
            this.testinfo.questions = this.questions;
        },
        mounted() {
            document.body.addEventListener('keyup', this.keyupHandler)
        },
        methods: {
            calculateScore() {
                let correctAnswers = _.filter(this.questions, question => {
                    return question.chosenAnswer == question.answers.correct;
                })
                this.score = (correctAnswers.length/this.questions.length)*100;
                console.log(correctAnswers.length, " questions were answered correctly");
                console.log((correctAnswers.length/this.questions.length)*100, " is your score");
            }
        },
        computed: {
            questions() {
            },
            answeredSoFar() {
                return _.filter(this.questions, 'chosenAnswer').length
            },
            sliderTransform() {
                let percentageX = -(this.currentQuestionIndex*100) + "%";
                return `transform: translate3d(${percentageX}, 0, 0)`
            }
        }
    }
</script>
<style lang="stylus" scoped>
@import '~imports/ui/styl/variables.styl'
@import '~imports/ui/styl/mixins'

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
    


.series-test
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
    .test-questions
        position relative
        overflow hidden
        padding 0 
        margin 0
        width 100%
        border-top 1px solid #0bddbe
        border-bottom 1px solid #0bddbe
        
        & > ul
            width 100%
            word-spacing 0
            white-space nowrap
            position relative
            transition transform 400ms ease
            & > li
                display inline-block
                width 100%
                vertical-align top
                padding 2% 14%
                margin 0
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
                            margin 0 30px
                            font-size 40px
                            font-family 'Helvetica Thin'
                            &.next
                                border-radius 4px
                                border 1px solid lighten(red, 15)
                                padding 1% 2%
                                color lighten(red, 15)
            .answer
                text-align center
                padding 8% 0 6% 0
                li a
                    font-family 'Helvetica Thin'
                    margin 0 30px
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
                    &:hover
                        border 1px solid lighten(#0bddbe, 25)
                        color darken(#0bddbe, 10)
                    &.chosen
                        border 1px solid darken(#0bddbe, 5)
                        background rgba(#0bddbe, 0.02)
                        color darken(#0bddbe, 5)
                
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
            &.answered
                border-color darken(#0bddbe, 15)
                background rgba(#0bddbe, 0.05)
                transform scale(0.82)
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


</style>