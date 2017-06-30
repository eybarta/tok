<template>
<div class="series-test">
    <h4>מה הספרה הבאה בסדרה?</h4>
    <ul :style="sliderTransform">
        <li v-for="(question, index) in questions" :key="question" :data-index="index" class="list-item">
            
            <div class="question">
                <!--When in Review-->
                <div ref="solution" v-if="mode=='review' && showsolution===index" class="solution">

                    <!-- CONTROLS -->
                    <transition-group tag="ul" name="fade-in-down" class="controls" appear>
                        <li class="fibo" v-if="showsolution===index && showControls===index && question.type.indexOf('fibo')>-1"
                            v-for="(x, fiboIndex) in question.parts.length-1"
                            :key="fiboIndex">
                            <span v-html="prepareControlForPart(question, fiboIndex, index)" ></span>
                        </li>
                        <li v-if="showsolution===index && showControls===index && question.type.indexOf('double')<0 && question.type.indexOf('fibo')<0"
                            v-for="(x, singleIndex) in question.parts.length"
                            :key="singleIndex">
                            <span v-html="prepareControlForPart(question, singleIndex, index)" ></span>
                        </li>
                        <li class='double'
                            v-if="showsolution===index && showControls===index && question.type.indexOf('double')>-1"
                            v-for="(x, dblIndex) in (question.parts.length===6 ? 3 : 2)"
                            :key="dblIndex">
                            <span v-html="prepareControlForPart(question, dblIndex, index)" ></span>
                        </li>
                        <li class='double other'
                            v-if="showsolution===index && showControls===index && question.type.indexOf('double')>-1"
                            v-for="(x, otherIndex) in 2"
                            :key="otherIndex">
                            <span v-html="prepareControlForPart(question, otherIndex, index, true)" ></span>
                        </li>
                    </transition-group>

                    <!-- SHIFTS -->
                    <transition-group tag="ul" name="fade-in-down" class="shifts" duration="1000" appear>
                        <li v-if="!!question.shifts[0] && showShifts===index && question.type.indexOf('double')<0"
                            v-for="(x, i) in (/power/.test(question.type) ? question.parts.length : question.parts.length-1)"
                            :class="[/power/.test(question.type) ? 'power' : '']"
                            :key="i">
                            <span v-html="question.shifts[0]==='power' ? i+1 : (question.shifts[0]>0 ? '+'+question.shifts[0] : question.shifts[0])"></span>
                        </li>
                        <li v-if="!!question.shifts[0] && showShifts===index && question.type.indexOf('double')>-1"
                            v-for="(x, i) in (question.parts.length===6 ? 2 : 1)"
                            :key="i">
                            <span v-html="question.parts.length===6 ? (question.shifts[0]>0 ? '+'+question.shifts[0] : question.shifts[0]) : (question.shifts[1]>0 ? '+'+question.shifts[1] : question.shifts[1])"></span>
                        </li>
                        <li class="othershift" v-if="!!question.shifts[0] && showShifts===index && question.type.indexOf('double')>-1"
                            v-for="(x, i) in 1"
                            :key="i">
                            <span v-html="question.parts.length===6 ? (question.shifts[1]>0 ? '+'+question.shifts[1] : question.shifts[1]) : (question.shifts[0]>0 ? '+'+question.shifts[0] : question.shifts[0])"></span>
                        </li>
                    </transition-group>
                </div>
                </transition>
                <div ref="parts" class="parts ltr">
                    <span v-for="part in question.parts" :key="part">{{ part }}</span>
                    <span v-if="mode==='review' && showsolution===index" class="next success">{{ question.answers.correct}}</span>
                    <span v-else class="next">?</span>
                </div>
            </div>
            <div class="answer">
            <button v-if="mode=='review'" :class="['btn', showsolution===index ? 'btn-warning' : 'btn-primary', 'mb-small']" @click="toggleSolution()" v-text="showsolution===index ? 'החבא פתרון' : 'הצג פתרון'"></button>
                <h5 class="rtl" v-text="mode==='test' ? 'נא לבחור אחת התשובות:' : 'תשובה שבחרת:'"></h5>
                <ul class="rtl">
                    <li v-for="(answer, answerIndex) in question.answers.list" :key="answerIndex">
                        <a href="#p" @click.prevent="updateChosenAnswer(question, answer)" 
                            :class="[
                                    question.chosenAnswer===answer ? 'chosen' : '', 
                                    mode==='review' && answer===question.answers.correct && showsolution===index ? 'correct' : '',
                                    mode==='review' && question.chosenAnswer===answer && answer!=question.answers.correct ? 'wrong' : '',
                                    answerIndex==questionIndex ? 'active' : '']" v-text="answer"></a>
                        <span class="rtl" v-text="'.'+answerLabel[answerIndex]"></span>
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
    props: ['mode', 'questions', 'questionIndex'],
    
    data() {
        return {
            answerLabel: ['א','ב','ג','ד'],
            showsolution: false,
            showControls: false,
            showShifts: false
        }
    },  
    watch: {
        'questionIndex'() {
            this.resetSolutionView();
        }
    },
    mounted() {
        let vm = this;
        $(window).on('resize', e => {
            if (!!vm.showsolution) {
                vm.resetSolutionView();
            } 
        })
    },
    computed: {
        sliderTransform() {
            let percentageX = -(this.questionIndex*100) + "%";
            return `transform: translate3d(${percentageX}, 0, 0)`
        }
    },
    methods: {
        updateChosenAnswer(question, answer) {
            if  (this.mode==='test') {
                 question.chosenAnswer=answer;
            }
        },
        toggleSolution() {
            if (!!this.showsolution || this.showsolution===0) {
                this.$set(this, 'showControls', false);
                this.$set(this, 'showShifts', false);
                setTimeout(function() {
                    this.$set(this, 'showsolution', false);
                }.bind(this), 400)
            }
            else {
                this.$set(this, 'showsolution', this.questionIndex);
                setTimeout(function() {
                    this.$set(this, 'showControls', this.questionIndex);
                    this.$set(this, 'showShifts', this.questionIndex);
                }.bind(this), 100)
            }
        },
        resetSolutionView() {
            this.$set(this, 'showsolution', false);
            this.$set(this, 'showControls', false);
            this.$set(this, 'showShifts', false);
        },
        prepareControlForPart(question, index, questionIndex, showother) {
            if (question.type==="fibonacci") {
                // "fibonacci"
                let parts = question.parts;
                let _calc = parts[index]+ ' + ' + parts[index+1];
                this.positionControlAndShift(index, questionIndex, null, question.type, question.parts.length, showother);
                return _calc;
            }
            let controls = _.clone(question.controls),
                operations =question.operations,
                shifts = !!question.shifts.length ? question.shifts : [0],
                partsLength = question.parts.length;
                isDouble = /double/i.test(question.type);
            if (!!controls && !!operations) {
                let fixedIndex = !!isDouble ? (partsLength>5 ? showother ? 1 : 0 : showother ? 0 : 1) : -1;
                // console.log('fixedIndex > ', fixedIndex);
                let i = fixedIndex>-1 ? fixedIndex : index%controls.length;
                let oi = fixedIndex>-1 ? fixedIndex : index%operations.length;
                let operation = operations[oi];
                if (questionIndex==14) {
                    console.log(">> controls >> ", controls);
                    console.log(">> operations >> ", operations);
                    console.log([questionIndex], "indexes[2] :: control :: shift ", i, " :: ", oi, " :: ", controls[i], " :: ", shifts[i]);
                }
                let operationIcon = function() {
                    switch(operation) {
                        case 'add':
                            return '&plus;';
                        case 'subtract':
                            return '&minus;';
                        case 'multiply':
                            return '&times;';
                        case 'divide':
                            return '&divide;';
                        default:
                            return '';
                    }
                }
                // console.log([questionIndex]," >>> amount of parts: ", question.parts.length, " :: ",  question.type, " :: ", controls[i], " :: ", shifts[i]);
                this.positionControlAndShift(index, questionIndex, !!shifts, question.type, question.parts.length, showother);
                if (questionIndex==14) {
                    console.log([questionIndex], " :: i= ", i, " :: control> ", controls[i], ' :: shift == ', shifts[i], ' :: index == ', index);
                }
                let _control = 
                    isNaN(shifts[i])
                    ? parseInt(controls[i])
                    : parseInt(controls[i] + shifts[i]*index);
                return /(add|substract)/.test(operation) && _control<0 ? _control : `${operationIcon()}` + _control;
            }
            return ''
        },
        positionControlAndShift(index, questionIndex, hasShift, type, partsLength, showother) {
            console.log(" INDEX to position >> ", index, ": ", questionIndex);
            let $controlTarget, parts, $leftHandPart, betweenOffsets, halfPoint, leftPosition, $shiftTarget;
            this.$nextTick(function() {
                $controlTarget = !!showother ? $(this.$refs.solution).find(".controls li.other").eq(index) : $(this.$refs.solution).find(".controls li").eq(index);
                parts = this.$refs.parts[questionIndex];
                if (type === 'fibonacci') {
                    $leftHandPart = $(parts).find('span').eq(index+2);
                    console.log($leftHandPart)
                    leftPosition = $leftHandPart.get(0).offsetLeft - $controlTarget.width()/3;
                }
                else if (type.indexOf('double')>-1) {
                    let indexes = partsLength < 6 ? (!!showother ? [0,2] : [1,3]) : (!!showother ? [1,3] : [0,2,4]) // starting points
                    $leftHandPart = $(parts).find('span').eq(indexes[index]);
                    if (questionIndex===12) {
                        console.log("indexes ", indexes, " :: ", index, " >>", $leftHandPart, " :: ", $controlTarget);
                        
                    }

                    betweenOffsets = [$leftHandPart.get(0).offsetLeft+$leftHandPart.width(), $leftHandPart.next().next().get(0).offsetLeft];
                    halfPoint = (betweenOffsets[1]-betweenOffsets[0])/2;
                    leftPosition = betweenOffsets[1] - halfPoint;
                }
                else {
                    $leftHandPart = $(parts).find('span').eq(index);
                    betweenOffsets = [$leftHandPart.get(0).offsetLeft+$leftHandPart.width(), $leftHandPart.next().get(0).offsetLeft];
                    halfPoint = (betweenOffsets[1]-betweenOffsets[0])/2;
                    leftPosition = betweenOffsets[1] - halfPoint;
                }
                $controlTarget.css('left', leftPosition);


                // Position shifts
                if (!!hasShift) {
                    // Get DOM Element
                    //!!showother ? $(this.$refs.solution).find(".controls li.other").eq(index) : $(this.$refs.solution).find(".controls li").eq(index);
                    $shiftTarget = !!showother ? $(this.$refs.solution).find(".shifts li.othershift").eq(index) : $(this.$refs.solution).find(".shifts li").eq(index);
                    // Calculate position
                    let left = /power/.test(type) ? betweenOffsets[1] : betweenOffsets[1]+$leftHandPart.next().width()/2;
                    // Give position to $shift element
                    $shiftTarget.css({ left });
                }
            })
        }

    }
}
</script>
<style lang="stylus" scoped>
@import '~imports/styl/variables.styl'
@import '~imports/styl/lib/rupture.styl'

.fade-in-down-enter-active, .fade-in-down-leave-active {
  transition all .2s ease
  transform translate(-50%, -50%)
  opacity 1
  position absolute
}
.fade-in-down-enter, .fade-in-down-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity 0
  transform translate(-50%, -100%) !important
}

.series-test
    .solution
        ul
            li
                position absolute
                display block
                font-size 22px
                border-radius 11px
                transform translate(-50%, -50%)
                z-index 5
                span
                    display block
                    position relative
                    font-size 22px
                    color #0ac5a9
                    padding 3px 16px
                    border-radius 11px
                    background #fff
                    z-index 5
                    

                    
            &.controls li
                span:first-letter
                    // color darken(#0ac5a9, 5)
                    padding-right 2px
                
                &:after
                    content '\2936'
                    color #0ac5a9
                    position absolute
                    bottom -15px
                    left 0px
                    width 100%
                    font-size 4vw
                    line-height 0
                    transform rotate(-135deg)
                    z-index 4
                &.double
                    z-index 6
                    transform translate(-50%, -150%)
                    span
                        +above(1400px)
                            width 3vw
                            height @width
                            line-height @width
                            border-radius unit(@width/2, 'vw')
                            border 1px solid rgba(#0ac5a9, 0.6)
                    &:after
                        font-size 12vw
                        left 2.5vw
                        bottom -3vh
                &.other
                    z-index 2
                    transform translate(-50%, 30%)
                    span
                        color lighten(red, 20)
                        transform translateY(300%)
                    span:first-letter
                        // color lighten(red, 20)
                    &:after
                        color lighten(red, 20)
                        transform rotate(-45deg) scaleY(1) scaleX(-1)
                &.fibo
                    font-size 16px
                    span
                        font-size 16px
            &.shifts li
                transform translate(-50%, -120%)
                span
                    color lighten(orange, 5)
                &:after
                    content '\21E2'
                    color lighten(orange, 5)
                    position absolute
                    bottom -8px
                    left 0px
                    width 100%
                    font-size 26px
                    line-height 0
                    z-index 4
                &.power
                    transform translate(-195%, -115%)
                    span
                        font-size 16px
                        background none
                        padding 0
                        border 0
                    &:after
                        content none
                &.othershift
                    transform translate(-50%, 298%)
                    &:after
                        bottom auto
                        top -8px


</style>