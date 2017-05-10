<template>
<div class="add-question">
    <ul class="submenu choose-category">
        <li v-for="category in filteredCategories" :class="[!!activecat && activecat.value==category.value ? 'active' : '']">
            <a href="#p" @click.prevent="activecat=category">{{category.label}}</a>
        </li>
    </ul>
    <div v-if="!!activecat" class="active-tab clearfix">
        <multiselect class="dropdown w-elastic-30 maxw-300" v-model="activesubcat" track-by="value" label="label" placeholder="תבחר סוג שאלה"
                    :options="activecat.children"
                    :show-labels="false"
                    :searchable="false"
                    :close-on-select="true"
                    :allow-empty="false"></multiselect>
        <button @click="save" :class="['btn', 'btn-success-inverse', 'mr-min', !validQuestionEntry ? 'disabled' : '']">שמור</button>
        <div class="form pt-med mt-med bt-dashed clear">
            <div class="line-field w-elastic-50 maxw-500">
                <textarea id="question" class="reg w-100" v-model="question" type="text" required></textarea>
                <label for="question">שאלה</label>
            </div>
            <div class="form-full block">
                <div v-for="(answer, index) in answers" class="line-field w-elastic-50 maxw-500">
                    <input :id="'answer'+index" class="reg w-100" v-model="answers[index]" type="text" required>
                    <label :for="'answer'+index" class="dots" v-text="index===0 ? 'תשובה נכונה' : 'עוד תשובה'"></label>
                </div>
            </div>
            <div class="">
                <button @click="save" :class="['btn', 'btn-success-inverse', !validQuestionEntry ? 'disabled' : '']">שמור</button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { categories } from '/imports/api/categories'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            activecat: null,
            activesubcat: null,
            question: null,
            answers: [
               null,
               null,
               null,
               null
            ]

        }
    },
    created() {
        this.initQuestions();
    },
    methods: {
        ...mapActions('testsModule', [
            'saveQuestion',
            'initQuestions'
        ]),
        save() {
            let data = {
                category: {
                    label: this.activecat.label,
                    value: this.activecat.value
                },
                type: {
                    label: this.activesubcat.label,
                    value: this.activesubcat.value,
                },
                question: this.question,
                answers: this.answers
            }

            let result = this.saveQuestion(data);

            console.log("RESULT >> ", result)

            this.reset();

        },
        reset() {
            let resetdata = {
                activesubcat: null,
                question: null,
                answers: [
                    null,
                    null,
                    null,
                    null
                ]
            }
            _.merge(this.$data, resetdata)
        }   
    },
    computed: {
        filteredCategories() {
            return _.filter(categories, category => { return category.value!='series'} )
        },
        validQuestionEntry() {
            return !!this.question 
                && _.compact(this.answers).length===this.answers.length
                && !!this.activesubcat.value;
        }
    }
}
</script>
<style lang="stylus">

</style>