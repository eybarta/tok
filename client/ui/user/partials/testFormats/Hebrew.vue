<template>
<div class="hebrew-test">
    <ul :style="sliderTransform">
        <li v-for="(question, index) in questions" :key="question" :data-index="index" class="list-item">

            <div class="question">
                <h4 v-text="question.question"></h4>            
            </div>
            <div class="answer">
                <h5 class="rtl"> נא לבחור אחת התשובות:</h5>
                <ul class="rtl">
                    <li v-for="(answer, index) in question.answers" :key="answer">
                        <a href="#p" @click.prevent="chooseAnswer(question, answer)" :class="[question.chosenAnswer===answer ? 'chosen' : '']" v-text="answer"></a>
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
    props: ['questions', 'questionIndex'],
    data() {
        return {
            answerLabel: ['א','ב','ג','ד']
        }
    },  
    created() {
        console.log('in hebrew questions > ', this.questions)
    },
    methods: {
        chooseAnswer(question, answer) {
            this.$set(question, 'chosenAnswer', answer)
            // this.$forceUpdate();
        }
    },
    computed: {
        
        sliderTransform() {
            let percentageX = -(this.questionIndex*100) + "%";
            return `transform: translate3d(${percentageX}, 0, 0)`
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~imports/styl/variables.styl'
@import '~imports/styl/lib/rupture.styl'

.hebrew-test
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
            @media screen and (max-width:740px)
                padding-left 8%
                padding-right 8%
            .question
                text-align center
                h4
                    padding 0 0 2%
                    font-size 25px
                    line-height 1.3
                    letter-spacing 1px
                    direction rtl
                    text-align center
                    white-space normal
                .parts
                    padding 2% 0
                    border-top 1px dashed rgba(darken(#0bddbe, 60), 0.2)
                    border-bottom 1px dashed rgba(darken(#0bddbe, 60), 0.4)
                    span
                        display inline-block
                        margin 0 5%
                        font-size 22px
                        font-family 'Helvetica Thin'
                        @media screen and (max-width:740px)
                            // margin 0 30px
                            font-size 22px
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
            ul
                white-space normal
                text-align right
            li
                display inline-block
                margin 2.2%
                white-space nowrap
            li a
                font-family 'Helvetica Thin'
                display inline-block
                vertical-align middle
                padding 10px
                max-width 90%
                border-radius 9px
                box-sizing border-box
                text-decoration none
                color lighten(darkblue, 20)
                font-size 26px
                border 1px solid transparent
                background transparent
                white-space normal
                transition border 400ms ease, background 400ms ease, color 400ms 
                +below(1200px)
                    font-size 24px
                & + span
                    vertical-align text-top
                    display inline-block
                    direction rtl
                @media screen and (max-width:740px)
                    // margin 0 30px
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
</style>