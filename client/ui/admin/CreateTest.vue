<template>
    <div class="create-test">
        <ul class="submenu choose-category">
            <li v-for="category in categories" :key="category.value" :class="[!!activecat && activecat.value==category.value ? 'active' : '']">
                <a href="#p" @click.prevent="activecat=category">{{category.label}}</a>
            </li>
        </ul>
        <div class="active-tab" v-if="!!activecat">
            <preloader v-if="!!saving"></preloader>
            <div>
                <button v-if="!showpasttest && !!testlist.length" :class="['btn','btn-primary', 'mb-big']" @click="showpasttest = true">הצג מבחנים קודמים</button>
                <div v-if="showpasttest" class="test-list child-list">
                    <h4>מבחנים קיימים: <button @click="showpasttest=false" class="btn btn-warning">הסתר מבחנים</button></h4>
                    <ul>
                        <li v-for="test in testlist" :key="test">
                            {{test.name}}
                            <i @click="removeTest(test)" class="fa fa-close"></i>
                        </li>
                    </ul>
                </div>
                <!--
                    CREATE TEST
                -->
                <div class="create-test-form">
                    <input :class="['reg', invalid&&!activetestdata.name.length ? 'invalid' : '']" v-model="activetestdata.name" type="text" placeholder="שם למבחן" required>
                    <button class="btn btn-primary-inverse mr-small"  @click="activecat.value==='series' ? generateSeriesTest() : generateTest()">צור מבחן אוטומטי</button>
                    <button v-if="activecat.value!='series'" @click="manualAmountsSelection=!manualAmountsSelection" :class="['btn', !!manualAmountsSelection ? 'btn-warning' : 'btn-primary', 'mr-min']">{{ !!manualAmountsSelection ? 'בטל בחירה ידנית' : 'בחירת שאלות ידנית' }}</button>
                    <button @click="save" v-if="activetestdata.questions.length===20" :class="['btn', 'btn-success-inverse', 'mr-min', !activetestdata.name.length ? 'disabled' : '']">שמור</button>
                </div>
                <h5 class="pt-med" v-if="!!totalAmountForCategory"><span v-text="'סה״כ שאלות ב'+activecat.label+':'"></span><strong v-text="totalAmountForCategory"></strong></h5>
                <ul v-if="!!manualAmountsSelection" class="child-list">
                    <li v-for="(child, key, index) in manualChildList" :key="index" :class="[!!child.active || !!child.amount ? 'active' : '']">
                        <i @click="removeFromManualSelection(child)" class="fa fa-close"></i>
                        <strong v-text="child.label"></strong>: <input @focus="activateChild(child,index)"  @blur="deactivateChild(child,index)" v-model.number="child.amount" min="0" type="number">
                        <span class="total-amount" v-text="'(' + (!!child.value ? totalAmountOfType(child.value) : child.totalAmount) +')'"></span>

                        <div v-if="hasCodesInCategory(child.value)" :class="['code-selection', !!child.activeCodes ? 'active' : '']">
                            <h5>לפי קידוד</h5>
                            <ul>
                                <li v-for="(value, key, i) in categoryQuestionsByType[child.value]" :key="i">
                                    <span v-text="key+':'"></span>
                                    <input type="text" @change="updateAmount(child, index)" v-model.number="child.codes[i].amount">
                                    <span class="total-amount" v-text="'('+totalAmountOfCode(child.value, key)+')'"></span>
                                </li>
                            </ul>
                        </div>
                        <button v-if="hasCodesInCategory(child.value)" class="more" @click="toggleActiveCodes(child, index)"><i :class="['fa', !child.activeCodes ? 'fa-chevron-down' : 'fa-chevron-up']"></i></button>
                    </li>
                </ul>
                <table class="data-table mt-big" v-if="!!activetestdata.type && activetestdata.type==='series'">
                    <thead>
                        <th>#</th>
                        <th>סוג</th>
                        <th>סדרה</th>
                        <th>תשובות</th>
                        <th>תשובה נכונה</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr class="ltr tright" v-for="(question, index) in activetestdata.questions" :key="index">
                            <td v-text="index+1" class="tcenter"></td>
                            <td v-text="question.label"></td>
                            <td v-text="question.parts.join(' | ')"></td>
                            <td v-text="question.answers.list.join(' | ')"></td>
                            <td v-text="question.answers.correct"></td>
                            <td class="tcenter"><i class="regen fa fa-repeat" @click="regenerateQuestion(question, index)"></i></td>
                        </tr>
                    
                    </tbody>
                </table>
                <table class="data-table test-table mt-big" v-else-if="!!activetestdata.type">
                   <thead>
                        <th>#</th>
                        <th>סוג</th>
                        <th>שאלה</th>
                        <th>תשובות</th>
                        <th>תשובה נכונה</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr class="ltr tright" v-for="(question, index) in activetestdata.questions" :key="index">
                            <td v-text="index+1" class="tcenter"></td>
                            <td v-text="question.type.label + (!!question.code ? ': ' + question.code : '')"></td>
                            <td v-text="question.question"></td>
                            <td v-text="question.answers.join(' | ')"></td>
                            <td v-text="question.answers[0]"></td>
                            <td class="tcenter"><i class="regen fa fa-repeat" @click="regenerateQuestion(question, index)"></i></td>
                        </tr>
                    
                    </tbody> 
                </table>                
                <button @click="save" v-if="activetestdata.questions.length===20" :class="['btn', 'btn-success-inverse', 'mt-med', !activetestdata.name.length ? 'disabled' : '']">שמור</button>
            </div>
        </div>
    </div>
</template>
<script>
import { categories } from '/imports/api/categories'
import { generateAutotest } from '/imports/api/generators/testGenerator'
import { questionGenerator } from '/imports/api/generators/questionGenerator'
import { mapState, mapActions } from 'vuex'
import Preloader from '/client/ui/components/Preloader.vue'


function initialData() {
    return {
        categories,
        showpasttest: false,
        activecat: null,
        manualAmountsSelection: false,
        invalid: false,
        groupedByType: null,
        activetestdata: {
            type: null,
            name: '',
            questions: []
        },
        manualChildList: [],
        saving: false
    }
}

export default {
    data() {
        return initialData()
    },
    created() {
        this.initQuestions()
        setTimeout(function() {
            console.log(this.questionbank);
        }.bind(this), 2000)
    },
    watch: {
        'manualAmountsSelection'() {
            if (!!this.manualAmountsSelection) {
                let list, keys;
                if (this.activecat.value === 'matrices') {
                    console.log('this.codedQuestions > ', this.codedQuestions);
                    list = _.map(this.codedQuestions, (value, key) => { 
                        console.log("key > ", key);
                        console.log("value > ", value);
                        return {
                            active:false,
                            label: key,
                            amount:1,
                            totalAmount: value.length
                        }
                    })
                }
                else {
                    list = _.clone(this.activecat.children);
                    keys = _.keysIn(this.categoryQuestionsByType);
                    _.forEach(list, obj => {
                        // for Coded questions list
                        if (!!keys && keys.indexOf(obj.value) > -1) {
                            obj.codes = [];
                            _.each(this.categoryQuestionsByType[obj.value], (value, key, i) => {
                                console.log('in amount selection >> ', value, key, i);
                                obj.codes.push(
                                    {
                                        code: key,
                                        amount: null
                                    }
                                )
                            })

                            obj.activeCodes = false;
                        }
                        obj.amount = 1;
                        obj.active = false;
                    })
                }                 
                console.log("LIST >> ", list);   
                this.$set(this, 'manualChildList', list);
                console.log(">> manual list: ", this.manualChildList)
                console.log(">>", this.categoryQuestionsByType)
            }
        },
        'activecat.value'() {
            this.manualAmountsSelection = false;
        }
    },
    methods: {
        ...mapActions('testsModule', [
            'saveFixedTestToDB',
            'removeFixedTest',
            'initQuestions'
        ]),
        ...mapActions('globalStore', [
            'setNote'
        ]),
        toggleActiveCodes(child, index) {
            child.activeCodes= !child.activeCodes;
            this.$set(this.manualChildList, index, child);
        },
        updateAmount(child, index) {
            child.amount = _.sumBy(child.codes, 'amount')
            this.$set(this.manualChildList, index, child)
        },
        hasCodesInCategory(val) {
            let keys = _.keysIn(this.categoryQuestionsByType);
            return keys.indexOf(val)>-1
        },
        totalAmountOfType(val) {
            let grouped = this.groupedByType;
            return grouped.hasOwnProperty(val) ? grouped[val].length : 0;
        },
        totalAmountOfCode(val, key) {
            return this.categoryQuestionsByType[val][key].length;
        },
        async generateTest() {
            console.log('generate test');
            this.$set(this.activetestdata, 'type', this.activecat.value);
            let categoryQuestionsInBank = _.find(this.questionbank, cat => cat.category.value === this.activecat.value)
            console.log('categoryQuestionsInBank >> ',this.questionbank, " :: ", categoryQuestionsInBank);
            let questions = [];
            if (!!this.manualAmountsSelection) {
                this.manualChildList = _.orderBy(this.manualChildList, [obj => parseInt(obj.amount)], ['desc'])
                this.manualChildList.forEach(child => {
                    console.log(child.value, " AMOUNT: ", child.amount);

                    /*
                        amount is either an Integer
                        or an object of codes with amounts
                    */
                    let amount = child.codes || parseInt(child.amount)
                    questions.push(...questionGenerator(this.activecat.value, child.value, child.label, amount, categoryQuestionsInBank))
                })
            }
            this.activetestdata.questions = questions;
        },
        async generateSeriesTest() {
            this.$set(this.activetestdata, 'type', this.activecat.value);
            if (!!this.manualAmountsSelection) {
                let questions = [];
                    this.manualChildList = _.orderBy(this.manualChildList, [obj => parseInt(obj.amount)], ['desc'])
                    this.manualChildList.forEach(child => {
                        console.log(child.value, " AMOUNT: ", child.amount);
                            questions.push(...questionGenerator(this.activecat.value, child.value, child.label, parseInt(child.amount)))
                    })
                    
                if (questions.length>20) {
                    questions.splice(20);
                } 
                else {

                    this.manualChildList.forEach(child => {
                        while(questions.length<20){
                            questions.push(...questionGenerator(this.activecat.value, child.value, child.label, 1))
                        }
                    })
                }
                console.log("QUESTIONS > ", questions);
                this.activetestdata.questions = questions;
            }
            else {
                this.activetestdata.questions = await generateAutotest(this.activecat.value)
            }
        },
        regenerateQuestion(question, index) {
            this.$set(this.activetestdata.questions, index, questionGenerator(this.activecat.value, question.type, question.label, 1)[0])
        },
        removeFromManualSelection(child) {
            this.$set(this, 'manualChildList', this.manualChildList.filter(_child => _child.value!=child.value))
        },
        activateChild(child, index) {
            child.active = true;
            this.$set(this.manualChildList, index, child);
            console.log('CODED QUESTION <<', this.codedQuestions)
        },
        deactivateChild(child,index) {
            child.active = false;
            this.$set(this.manualChildList, index, child);
        },
        removeTest(test) {
            let testdata = _.merge({type:this.activecat.value}, test)
            this.removeFixedTest(testdata);
        },
        reset() {
            this.$set(this, 'activecat', null);
            this.$set(this, 'manualAmountsSelection', false);
            this.$set(this, 'invalid', false);
            this.$set(this, 'activetestdata', {type:null,name:'', questions:[]});
            this.$set(this, 'manualChildList', []);
            this.$set(this, 'saving', false);
        },
        async save() {
            if (!this.activetestdata.name.length) {
                this.invalid = true;
                return false;
            }
            else {
                this.saving = true;
                // SAVE TEST TO DB
                // console.log("save test to db >> ", this.activetestdata);
                let result = await this.saveFixedTestToDB(this.activetestdata);
                if (!!result) {
                    console.log("result from saving fixed test >> ", result);
                    this.reset();
                }
            }
        }
    },
    computed: {
        ...mapState('testsModule', [
            'fixedtests',
            'questionbank'
        ]),
        totalAmountForCategory() {
            let codedQuestions = this.codedQuestions;
            if (!!codedQuestions) {
                return _.flatMap(codedQuestions).length
            }
            return null;
        },
        testlist() {
            let vm = this;
            if (!!this.activecat) {
                let testsOfType = _.find(vm.fixedtests, tests => vm.activecat.value===tests.type)
                console.log('testsOfType > ', testsOfType)
                if (!!testsOfType) {
                    return testsOfType.tests;
                }
            }
            return [];
        },
        categoryQuestions() {
            let questionsFromCategory,
            category = !!this.activecat ? this.activecat.value : null;
            if (!!category) {
                questionsFromCategory = _.find(this.questionbank, obj => obj.category.value===category)
                if (!!questionsFromCategory) {
                    return questionsFromCategory.questions;
                }
                // console.log("questions form category .> ", questions);
            }
        },
        categoryQuestionsByType() {
            let grouped = _.groupBy(this.categoryQuestions, 'type.value');
            if (!!grouped) {
                this.groupedByType = _.clone(grouped);
                let bytype = _.each(grouped, function(value, key, obj) {
                    obj[key] = _.groupBy(obj[key], 'code')
                }); 
                return bytype;
            }
            return grouped;
            // return grouped;
            
        },
        codedQuestions() {
            return _.groupBy(this.categoryQuestions, 'code');
        }
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/variables.styl'
.submenu
    width 100%
    padding 15px 3px
    border-top 1px solid lighten(primaryblue, 5)
    border-bottom 1px solid lighten(primaryblue, 5)
    text-align center
    li
        display inline-block
        vertical-align middle
        padding 0 3%
        a
            color lighten(gray, 40)
            transition color 300ms ease
        &:hover a, &.active a
            color lighten(primaryblue, 6)

.regen
    color lighten(gray, 40)
    transition color 300ms ease
    &:hover
        color rgba(bluegreen, 0.8)

.child-list
    padding-top 30px
    li
        position relative
        display inline-block
        margin 10px 0 10px 36px
        white-space nowrap
        padding 10px
        border 1px solid bluegreen
        border-radius 4px
        opacity 0.3
        transition opacity 200ms ease-out
        &:hover, &.active
            opacity 1
            li
                opacity 1
        strong
            display inline-block
        input
            height auto
            border 0
            border-bottom 1px solid darkblue
            border-radius 0
            width auto
            max-width 40px
            display inline-block
.test-list ul
    padding 10px 0 30px

button.more
    background rgba(#fff, 0.8)
    padding 1%
    color lighten(orange, 10)
    border 1px solid rgba(10,197,169,0.7)
    width 24px
    height 24px
    border-radius 12px
    position absolute
    right 0
    bottom 0
    transform translate(50%, 50%)
    background rgba(255,255,255,0.9)
    cursor pointer
    outline 0
    z-index 11
    .active + &
        z-index 9992
    &:focus,
    &:active
        outline 0
    i
        font-size 14px
        opacity 0.5
        transition opacity 300ms ease
    &:hover i
        opacity 1

.code-selection
    position absolute
    min-width 100%
    right 0
    top 100%
    padding 15px
    border 1px solid primaryblue
    border-top-color bluegreen
    border-radius 0 0 4px 4px
    background #fff
    opacity 0
    transform translate(0, -100%)
    transition opacity 200ms ease-out, transform 600ms ease-out
    z-index -1
    &.active
        opacity 1
        z-index 9991
        transform translate(0,0)
        transition opacity 600ms ease-out, transform 200ms ease-out
    h5
        font-size 14px
    ul
        padding-top 10px
        li
            display list-item
            border 0
            margin 0
            padding 5px 0
            span
                display inline-block
                text-align left
                min-width 28px
            input
                margin-right 5px

.total-amount
    color darken(lightgray, 20)
    font-size 13px
</style>