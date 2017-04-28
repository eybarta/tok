<template>
    <div class="create-test">
        <ul class="submenu choose-category">
            <li v-for="category in categories" :class="[!!activecat && activecat.value==category.value ? 'active' : '']">
                <a href="#p" @click.prevent="activecat=category">{{category.label}}</a>
            </li>
        </ul>
        <div class="active-tab" v-if="!!activecat">
            <div class="create-test-form">
                <input :class="['reg', invalid&&!activetestdata.name.length ? 'invalid' : '']" v-model="activetestdata.name" type="text" placeholder="שם למבחן" required>
                <button class="btn btn-primary-inverse mr-small" v-if="activecat.value==='series'" @click="generateSeriesTest">צור מבחן אוטומטי</button>
                <button @click="save" v-if="activetestdata.questions.length===20" :class="['btn', 'btn-success-inverse', 'mr-min', !activetestdata.name.length ? 'disabled' : '']">שמור</button>
            </div>

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
        </div>
    </div>
</template>
<script>
import { categories } from '/imports/api/categories'
import { generateAutotest } from '/imports/api/generators/testGenerator'
import { questionGenerator } from '/imports/api/generators/questionGenerator'
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            categories,
            activecat: null,
            invalid: false,
            activetestdata: {
                type: null,
                name: '',
                questions: []
            }
        }
    },
    methods: {
        ...mapActions('testsModule', [
            'saveFixedTestToDB'
        ]),
        generateSeriesTest() {
            this.$set(this.activetestdata, 'type', this.activecat.value);
            this.activetestdata.questions = generateAutotest(this.activecat.value)
        },
        regenerateQuestion(question, index) {
            this.$set(this.activetestdata.questions, index, questionGenerator(this.activecat.value, question.type, question.label, 1)[0])
        },
        save() {
            if (!this.activetestdata.name.length) {
                this.invalid = true;
                return false;
            }
            else {
                // SAVE TEST TO DB
                // console.log("save test to db >> ", this.activetestdata);
                this.saveFixedTestToDB(this.activetestdata);
            }
        }
    }
}
</script>
<style lang="stylus">
@import '~imports/ui/styl/variables.styl'

.create-test
    padding-top 40px
.active-tab
    padding 40px 20px
.submenu
    width 100%
    padding 15px 3px
    border-top 1px solid darken(bluegreen, 10)
    border-bottom 1px solid darken(bluegreen, 10)
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
</style>