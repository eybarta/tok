<template>
    <div class="create-test">
        <ul class="submenu choose-category">
            <li v-for="category in categories" :class="[!!activecat && activecat.value==category.value ? 'active' : '']">
                <a href="#p" @click.prevent="activecat=category">{{category.label}}</a>
            </li>
        </ul>
        <div class="active-tab" v-if="!!activecat">
            <preloader v-if="!!saving"></preloader>
            <div>
                <div v-if="!!testlist.length" class="test-list child-list">
                    <h4>מבחנים קיימים:</h4>
                    <ul>
                        <li v-for="test in testlist">
                            {{test.name}}
                            <i @click="removeTest(test)" class="fa fa-close"></i>
                        </li>
                    </ul>
                </div>
                <div class="create-test-form">
                    <input :class="['reg', invalid&&!activetestdata.name.length ? 'invalid' : '']" v-model="activetestdata.name" type="text" placeholder="שם למבחן" required>
                    <button class="btn btn-primary-inverse mr-small" v-if="activecat.value==='series'" @click="generateSeriesTest">צור מבחן אוטומטי</button>
                    <button @click="manualAmountsSelection=!manualAmountsSelection" :class="['btn', !!manualAmountsSelection ? 'btn-warning' : 'btn-primary', 'mr-min']">{{ !!manualAmountsSelection ? 'בטל בחירה ידנית' : 'בחירת שאלות ידנית' }}</button>
                    <button @click="save" v-if="activetestdata.questions.length===20" :class="['btn', 'btn-success-inverse', 'mr-min', !activetestdata.name.length ? 'disabled' : '']">שמור</button>
                </div>
                <ul v-if="!!manualAmountsSelection" class="child-list">
                    <li v-for="(child, index) in manualChildList" :class="[!!child.active || !!child.amount ? 'active' : '']">
                        <i @click="removeFromManualSelection(child)" class="fa fa-close"></i>
                        <strong v-text="child.label"></strong>: <input @focus="activateChild(child,index)"  @blur="deactivateChild(child,index)" v-model="child.amount" min="0" type="number">
                    </li>
                </ul>
                <table class="data-table mt-big" v-if="!!activetestdata.type">
                    <thead>
                        <th>#</th>
                        <th>סוג</th>
                        <th>סדרה</th>
                        <th>תשובות</th>
                        <th>תשובה נכונה</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr class="ltr tright" v-for="(question, index) in activetestdata.questions">
                            <td v-text="index+1" class="tcenter"></td>
                            <td v-text="question.label"></td>
                            <td v-text="question.parts.join(' | ')"></td>
                            <td v-text="question.answers.list.join(' | ')"></td>
                            <td v-text="question.answers.correct"></td>
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
        activecat: null,
        manualAmountsSelection: false,
        invalid: false,
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
    watch: {
        'manualAmountsSelection'() {
            if (!!this.manualAmountsSelection) {
                let list = _.clone(this.activecat.children);
                list.forEach(obj => {obj.amount = 1; obj.active = false;})
                this.$set(this, 'manualChildList', list);

            }
        }
    },
    methods: {
        ...mapActions('testsModule', [
            'saveFixedTestToDB',
            'removeFixedTest'
        ]),
        ...mapActions('globalStore', [
            'setNote'
        ]),
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
            'fixedtests'
        ]),
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
        }
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/variables.styl'
.submenu
    width 100%
    padding 15px 3px
    border-top 1px solid darken(bluegreen, 1)
    border-bottom 1px solid darken(bluegreen, 1)
    text-align center
    li
        display inline-block
        vertical-align middle
        padding 0 3%
        a
            color lighten(gray, 40)
            transition color 300ms ease
        &:hover a, &.active a
            color darken(bluegreen, 10)

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
        margin 10px 0 10px 20px
        white-space nowrap
        padding 10px
        border 1px solid bluegreen
        border-radius 4px
        opacity 0.3
        transition opacity 200ms ease-out
        &:hover, &.active
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

</style>