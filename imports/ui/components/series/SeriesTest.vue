<template>
    <div class="series-wrap">
        <div class="series-test">
            <h2>מבחן סדרות</h2>
                <paginate
            name="items"
            :list="items"
            :per="1"
            tag="div"
            >
            <transition-group ref="list" name="list" tag="ul" class="list test-questions" mode="in-out">
                <li v-for="(question, index) in paginated('items')" :key="question.answers.correct" :data-index="index" class="list-item">
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
            </transition-group>
            </paginate>
        <div class="pager">
	        <paginate-links ref="pager" for="items" :limit="4" 
            :show-step-links="true"
            :step-links="{next: 'Next', prev: 'Prev'}"></paginate-links>
        </div>

        <div class="status">
            <h4>ענית עד כה על <span>{{ answeredSoFar }}</span><span>/{{ items.length}}</span></h4>
        </div>
        </div>
    </div>
</template>
<script>
import Velocity from 'velocity-animate';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { questionGenerator } from '/imports/api/questionGenerator'
    export default {
        data() {
            return {
                testinfo: {
                    userId: Accounts.userId(),
                    questions: []
                },
                paginate: ['items'],
            }
        },
        created() {
            this.testinfo.questions = this.items;
        },
        components: {
		    swiper,
		    swiperSlide
	    },
        methods: {
            
        },
        computed: {
            items() {
                return questionGenerator('series', 'add', 20);
            },
            answeredSoFar() {
                return _.filter(this.items, 'chosenAnswer').length
            }
        }
    }
</script>
<style lang="stylus">
@import '~imports/ui/styl/variables.styl'
h4
    padding 0 0 2%
    font-family 'Alef Regular'
    font-size 25px
    letter-spacing 1px
    direction rtl
    text-align center
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
    top 50%
    left 0
    transform translateY(-50%)
    height 50vh
    width 100%
    h2
        text-align center
        color lighten(darkblue, 10)
        padding 40px 0
        font-family 'Alef Bold'
        font-weight normal
    .test-questions
        overflow hidden
        padding 0 
        margin 0
        width 100%
        border-top 1px solid #0bddbe
        border-bottom 1px solid #0bddbe
        word-spacing 0
        white-space nowrap
        & > li
            display inline-block
            width 100%
            vertical-align top
            padding 2% 14%
            .question
                text-align center
                .parts
                    padding 2% 0
                    border-top 1px dashed rgba(darken(#0bddbe, 60), 0.2)
                    border-bottom 1px dashed rgba(darken(#0bddbe, 60), 0.4)
                    span
                        display inline-block
                        margin 0 30px
                        font-size 40px
                        &.next
                            border-radius 4px
                            border 1px solid lighten(red, 15)
                            padding 1% 2%
                            color lighten(red, 15)
    .answer
        text-align center
        padding 8% 0 6% 0
        li a
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
            color orange


</style>