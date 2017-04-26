<template>
<div class="test-questions ltr">
    <h4>מה הספרה הבאה בסדרה?</h4>
    <ul :style="sliderTransform">
        <li v-for="(question, index) in questions" :key="question" :data-index="index" class="list-item">
            <div class="question">
                <div class="parts ltr">
                    <span v-for="part in question.parts">{{ part }}</span>
                    <span class="next">?</span>
                </div>
            </div>
            <div class="answer">
                <h5 class="rtl"> נא לבחור אחת התשובות:</h5>
                <ul class="rtl">
                    <li v-for="(answer, index) in question.answers.list">
                        <a href="#p" @click.prevent="question.chosenAnswer=answer" :class="[question.chosenAnswer==answer ? 'chosen' : '']" v-text="answer"></a>
                        <span class="rtl" v-text="'.'+answerLabel[index]"></span>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
    data() {
        return {
            answerLabel: ['א','ב','ג','ד']
        }
    },  
    computed: {
        ...mapState('testsModule', [
            'questionIndex'
        ]),
        ...mapGetters('testsModule', [
            'questions'
        ]),
        sliderTransform() {
            let percentageX = -(this.questionIndex*100) + "%";
            return `transform: translate3d(${percentageX}, 0, 0)`
        }
    }
}
</script>
<style lang="stylus">
@import '~imports/ui/styl/variables.styl'
.test-questions
    position relative
    overflow hidden
    padding 0 
    margin 0
    width 100%
    border-top 1px solid #0bddbe
    border-bottom 1px solid #0bddbe
    h4
        padding 40px 0 0
        font-size 25px
        letter-spacing 1px
        direction rtl
        text-align center
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
            padding 6% 14% 2%
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
            h5
                padding-bottom 20px
            li
                display inline-block
                margin 0 30px
            li a
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
                &:hover
                    border 1px solid lighten(#0bddbe, 25)
                    color darken(#0bddbe, 10)
                &.chosen
                    border 1px solid darken(#0bddbe, 5)
                    background rgba(#0bddbe, 0.02)
                    color darken(#0bddbe, 5)
                    & + span
                        color darken(#0bddbe, 5)
</style>