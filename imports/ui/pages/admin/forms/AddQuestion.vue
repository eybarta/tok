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
        <div class="form pt-med mt-med bt-dashed clear">
            <div class="line-field w-elastic-50 maxw-500">
                <input id="question" class="reg w-100" v-model="question" type="text" required>
                <label for="question">שאלה</label>
            </div>
            <div class="pt-big">
                <div v-for="(answer, index) in answers" class="line-field w-elastic-50 maxw-500 pb-med">
                    <input :id="'answer'+index" class="reg w-100" v-model="answers[index]" type="text" required>
                    <label :for="'answer'+index" v-text="'תשובה' + ' ' + (index+1)"></label>
                </div>
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
    computed: {
        filteredCategories() {
            return _.filter(categories, category => { return category.value!='series'} )
        }
    }
}
</script>
<style lang="stylus">

</style>