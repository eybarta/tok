<template>
<div class="add-question">
    <ul class="submenu choose-category">
        <li v-for="category in filteredCategories" :class="[!!activecat && activecat.value==category.value ? 'active' : '']" :key="category">
            <a href="#p" @click.prevent="updateActiveCat(category)">{{category.label}}</a>
        </li>
    </ul>
    <div v-if="!!activecat" class="active-tab clearfix">
        <button :class="['btn', !!showhistory ? 'btn-warning' : 'btn-primary']"
        @click="showhistory=!showhistory" v-text="!!showhistory ? 'החבא שאלות קיימות' : 'הצג שאלות קיימות'"></button>
        <div v-if="!!showhistory && !!questionsGroupedByType" class="question-list child-list">
            <h4>שאלות בבנק:</h4>
            <div class='qcat' v-for="(questions,key,index) in questionsGroupedByType" :key="key">
                <h5 v-text="questions[0].type.label"></h5>
                <ul>
                    <li v-for="(question, index) in questions" :key="index">
                    <span class="q">שאלה: 
                        <img v-if="activecat.value==='matrices'" :src="question.question">
                        <span v-else v-text="question.question"></span>
                    </span>
                    <span class="a">תשובות: 
                        <img v-if="activecat.value==='matrices'" v-for="answer in question.answers.list" :src="answer" :key="answer"> 
                        <span v-else v-text="answer"></span>
                    </span>
                    <i class="fa fa-close x-btn" @click="removeQuestionFromDB(question)"></i>
                    </li>
                </ul>
            </div>
            
        </div>
        <div v-if="!!log" class="log-msg">
            <h5 v-text="logMsg"></h5>
            <button @click="log=false; logMsg=null" class="btn btn-success" v-text="'הוסף עוד שאלה או שאלות ב' + activecat.label"></button>
        </div>
        <div class="pt-big mt-med bt-dashed clear" v-else>
            <multiselect v-if="!!activecat.children && activecat.children.length" class="dropdown w-elastic-30 maxw-300" v-model="activesubcat" track-by="value" label="label" placeholder="תבחר סוג שאלה"
                        :options="activecat.children"
                        :show-labels="false"
                        :searchable="false"
                        :close-on-select="true"
                        :allow-empty="false"></multiselect>
            <button @click="save" :class="['btn', 'btn-success', 'mr-min', !validQuestionEntry ? 'disabled' : '']">שמור</button>
            <div class="form">
                <div v-if="activecat.value==='matrices'">
                    <div class="matrice-question" v-for="(item, itemindex) in list" :key="item" :class="['qa', 'more', activeQuestionIndex===itemindex ? 'active' : '']">
                        <button v-if="list.length>1" :class="[activeQuestionIndex===itemindex ? 'min' : 'max' ]" @click="changeActiveQuestionIndex(itemindex)" ><span></span></button>
                        <transition name="fade-slide">
                            <div v-if="activeQuestionIndex===itemindex">
                                <div class="form-full block">
                                    
                                    <image-field 
                                        v-for="(answer, index) in item.answers.list"
                                        :key="index"
                                        v-model="item.answers[index]"
                                        :placeholder="index>0 ? 'תשובה שגויה' : 'תשובה נכונה'"
                                        ></image-field>
                                    
                                    <div :class="['field', 'flb', 'mt-big']">
                                        <input v-model="item.code" :id="'code'+itemindex" type="text" required>
                                        <label :for="'code'+itemindex">קידוד</label>
                                    </div>
                                     <div class="field flb mt-small">
                                        <textarea v-model="item.explanation" required></textarea>
                                        <label :for="'explanation'+itemindex">הסבר תשובה</label>
                                    </div> 
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <div v-else>
                    <div v-for="(item, itemindex) in list" :key="itemindex" :class="['qa', 'more', activeQuestionIndex===itemindex ? 'active' : '']">
                        <button v-if="list.length>1" :class="[activeQuestionIndex===itemindex ? 'min' : 'max' ]" @click="changeActiveQuestionIndex(itemindex)" ><span></span></button>
                        <transition name="fade-slide">
                            <div v-if="activeQuestionIndex===itemindex">
                                <div class="field flb w-elastic-50 maxw-500 pb-big">
                                    <textarea :id="'question'+itemindex" class="reg w-100" v-model="item.question" type="text" required></textarea>
                                    <label :for="'question'+itemindex">שאלה</label>
                                </div>
                                <div class="form-full block">
                                    <div v-for="(answer, answerindex) in item.answers.list" :key="answerindex" class="field flb w-elastic-50 maxw-500">
                                        <input :id="'answer'+answerindex" class="reg w-100" v-model="item.answers.list[answerindex]" type="text" required>
                                        <label :for="'answer'+answerindex" class="dots" v-text="answerindex===0 ? 'תשובה נכונה' : 'עוד תשובה'"></label>
                                    </div>
                                    <div :class="['field', 'flb', !!questionAsImage&&itemindex>0 ? 'disabled' : '']">
                                        <input v-model="item.code" :id="'code'+itemindex" type="text" :disabled="!!questionAsImage&&itemindex>0" required>
                                        <label v-if="!questionAsImage||!!questionAsImage&&itemindex<1" :for="'code'+itemindex">קידוד</label>
                                    </div>
                                    <div class="field flb mt-small">
                                        <textarea v-model="item.explanation" required></textarea>
                                        <label :for="'explanation'+itemindex">הסבר תשובה</label>
                                    </div>                               
                                </div>
                            </div>
                        </transition>
                        
                    </div>
                </div>
                <div class="pt-small">
                    <label v-if="!!uploader" class="dropzone">
                        <input type="file" @change="uploadFile('uploader', null, $event)" hidden>
                        <img ref="preview" v-if="!!previewimage" class="preview-image" :src="previewimage" alt="">
                        <div class="upload" v-else>
                            <img v-if="!!uploading" class="loader-icon spinning-cog hidden" src="/img/cog-loader.svg" data-cog="cog02">
                            <i v-else :class="['fa', activecat.value==='matrices' ? ' fa-th' : 'fa-upload']"></i>
                            <span v-text="!!uploading ? 'מעלה קובץ...' : activecat.value==='matrices' ? 'העלת מטריצה' : 'להעלות תמונה'"></span>
                        </div>
                    </label>
                </div>            
            </div>
            <div class="">
                <button @click="save" :class="['btn', 'btn-success', !validQuestionEntry ? 'disabled' : '']">שמור</button>
                <button @click="anotherQuestion" :class="['btn', 'btn-primary', !validQuestionEntry ? 'disabled' : '']">שמור והוסף שאלה<i class="fa fa-plus-circle mr-small"></i></button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
// import VueCoreImageUpload from '/imports/plugins/vue-core-image-upload/src/vue-core-image-upload.vue';
import { ImageStore } from '/imports/api/collections/images';
import {UploadFS} from 'meteor/jalik:ufs';
import { categories } from '/imports/api/categories'
import { mapActions, mapState } from 'vuex';
import ImageField from '/client/ui/components/form/ImageField.vue'
const questionObj = {
    question: null,
    code: null,
    explanation: null,
    answers: {
        correct: null,
        list: [
            null,
            null,
            null,
            null
        ]
    }
        
}
export default {
    data() {
        return {
            activeQuestionIndex: 0,
            activecat: null,
            activesubcat: null,
            list: [_.cloneDeep(questionObj)],            
            uploader: false,
            uploading:false,
            previewimage: null,
            log: null,
            logMsg: null,
            showhistory: false
        }
    },
    created() {
        this.initQuestions();
        this.$set(this, 'activecat', null);
        console.log();
        
    },
    components: {
        ImageField
    },
    mounted() {
        console.log("add q mounted >> ", this.list);
    },
    watch: {
        'activecat'() {
            if (!!this.activecat && this.activecat.value==='matrices') {
                this.$set(this, 'uploader', true);
                let q = _.cloneDeep(questionObj);
                q.answers.list = q.answers.list.concat([null,null,null,null]);
                // this.list.push(q);
                this.$set(this, 'list', [q]);
            }
            else {
                this.$set(this, 'uploader', false);
            }
        },
        list: {
            handler() {
                let list = this.list;
                this.$set(this, 'list', list)
            },
            deep:true
        },
        
        'activesubcat'() {
            this.$set(this, 'activeQuestionIndex', 0)
            if (!!this.questionAsImage) {
                this.$set(this, 'uploader', true);
                this.$set(this, 'list', [_.merge({ imageUrl: null}, _.cloneDeep(questionObj))])
            }
            else {
                this.$set(this, 'uploader', false);
                this.$set(this, 'list', [_.cloneDeep(questionObj)])
            }
        }
    },
    methods: {
        ...mapActions('testsModule', [
            'saveQuestion',
            'initQuestions',
            'removeQuestion'
        ]),
        removeQuestionFromDB(question){
            let category = {
                label: this.activecat.label,
                value: this.activecat.value
            }
            question.category = category;
            this.removeQuestion(question)
        },
        getAnswerImg(listindex, answerindex) {
            console.log("get answer > ", this.list[listindex].answers[answerindex]);
            return this.list[listindex].answers[answerindex];
        },
        updateActiveCat(category) {
            this.$set(this, 'activecat', category);
        },
        changeActiveQuestionIndex(index) {
            console.log('change question index> ', index);
            this.$set(this, 'activeQuestionIndex',index)
        },
        uploadFile(from, target, e) {
            let vm = this;
            let files = e.currentTarget.files;

            this.uploading = true;
            Cloudinary.upload(files, {
                eager: [{ width: 600, crop: "fit" }], 
                use_filename: true,
                unique_filename: false,
                resource_type: 'image'    
            }, (err,res) => {
                console.log("cloudinary upload.>>", res);
                vm.uploading = false;
                vm.$set(vm, 'previewimage', res.url);
                if (this.activecat.value==='matrices') {
                    vm.list[vm.activeQuestionIndex].question = res.url;
                }
            });
        },
        fileDropped(res) {
            console.log("File dropped>> ", res);
        },
        save() {
            let valid = true;
            _.each(this.list, function(obj) {
                obj.answers.correct = obj.answers.list[0];
                obj.answers.list = _.shuffle(_.compact(obj.answers.list));

                valid = !!obj.answers.correct && obj.answers.list.length>1
            })

            if (!valid) {
                alert('יש שדות שחייבים למלא..')
                return false;
            }
            console.log('thislist  .. ', this.list);
            let data = {
                category: {
                    label: this.activecat.label,
                    value: this.activecat.value
                },
                questions: this.list,
                imageUrl: this.previewimage
                // answers: this.answers
            }

            if (!!this.activesubcat) {
                data.type = {
                    label: this.activesubcat.label,
                    value: this.activesubcat.value,
                }
            }
            let result = this.saveQuestion(data);

            console.log("RESULT >> ", result)

            this.reset();

            function compactList(list) {
                
            }
        },
        anotherQuestion() {
            console.log('add another question >> ', questionObj);
            let qo = _.cloneDeep(questionObj)
            if (this.questionAsImage) {
                // use same code for all question attached to an image.
                qo.code = this.list[0].code;
            }
            this.list.push(qo)
            // this.list.push(_.cloneDeep(questionObj));
            this.$set(this, 'activeQuestionIndex', this.list.length-1);
        },
        reset() {
            this.log = true;
            this.logMsg = (this.list.length>1 ? "שאלות הוספו " : "שאלה הוספה ") + "בהצלחה";

            this.activeQuestionIndex = 0;
            this.activesubcat = null;
            this.list = [_.cloneDeep(questionObj)];
            this.uploader = false,
            this.uploading = false;
            this.previewimage = null;

            
        }   
    },
    computed: {
        questionAsImage() {
            return !!this.activesubcat && /(analyze|comprehension)/.test(this.activesubcat.value);
        },
        filteredCategories() {
            return _.filter(categories, category => { return category.value!='series'} )
        },
        validQuestionEntry() {
            let firstQuestion = this.list[0];
            return !!firstQuestion.question 
                // && _.compact(firstQuestion.answers).length===firstQuestion.answers.length
                && this.activecat.value==='matrices' || (!!this.activesubcat && this.activesubcat.value);
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
        questionsGroupedByType() {
            let questions = this.categoryQuestions;
            if (!!questions) {
                return _.groupBy(questions, 'type.value')
            }
            return null;
        },
        imageDimensions() {
            if (!!this.previewimage) {
                console.log("preview ref", this.$refs.preview, " :: ", this.$refs);
                this.$nextTick(function() {
                    return {
                        width: this.$refs.preview.naturalWidth,
                        height: this.$refs.preview.naturalHeight,
                    }
                })
                
            }
            return null;
        },
        ...mapState('testsModule', [
            'images',
            'questionbank'
        ])
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/variables.styl'
@import '~imports/styl/settings'
.fade-slide-enter-active, .fade-slide-leave-active {
  transition all .3s ease-out
  transform scale(1, 1)
}
.fade-slide-enter, .fade-slide-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity 0
  transform scale(1, 0)
}


.qa
    position relative
    padding 30px 40px 30px 20px
    border-right 1px solid lighten(gray, 45)
    background rgba(orange, 0.12)
    max-height 30px
    transition max-height 400ms ease-out
    border-bottom 1px dotted lighten(gray, 45)
    border-top 1px dotted lighten(gray, 45)
    cursor pointer
    & > div
        position relative
        transform-origin top
    &:last-child
        border-top 0
    for num in (1...10)
        &:nth-child({num})
            &:after
                content 'שאלה ' +num
                position absolute
                top 50%
                right 40px
                transform translateY(-50%) 
    &.active
        max-height 600px
        border-bottom 0
        border-top 0
        border-radius 0 0 0 12px
        background #fff
        cursor initial
        &:after
         content none
        &.more
            max-height 900px
    .min, .max
        position absolute
        right 0
        top 20px
        width 100%
        font-size 22px
        background none
        border 0
        cursor pointer
        color lighten(gray, 20)
        outline none
        span
            self-center()
            width 30px
            height 30px
            left 100%
            border-radius 15px
            border 1px solid lighten(gray, 40)
            background #fff
            &:before
                content ''
                self-center()
                left 50%
                height 2px
                width 16px
                background lighten(gray, 30)
                border-radius 4px
        &.max
            top 50%
            transform translateY(-50%)
            span:after
                content ''
                self-center()
                left 50%
                width 2px
                height 16px
                background lighten(gray, 30)
                border-radius 4px
.dropzone
    display block
    height 100%
    border-radius 9px
    text-align center
    min-height 44vh
    position relative
    cursor pointer
    background lighten(gray, 85)
    border 1px solid lighten(gray, 80)
    overflow hidden
    &:hover
        border-style dashed
    .upload
        self-center()
        i, img
            display block
            margin 5px auto
            opacity 0.7
        i
            font-size 28px
        span
            font-size 18px
        i,span
            color lighten(gray, 50)

    .preview-image
        width 100%
        self-center()
    .dz-message
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
        span
            font-size 24px
            font-family "Varela Round"
            color lighten(gray, 20)
        i
            display block
            margin 5px auto
            font-size 30px
            color lighten(gray, 22)
.matrice-question
    label
        display inline-block
        width 45%
        margin 0 0 0 5%
.log-msg
    margin 5% auto
    text-align center
    h5
        font-size 26px
        padding-bottom 30px 
.answer-img
    height 40px

.question-list 
    .qcat
        margin 10px 0
        padding 5px 0
        border-bottom 1px dotted primaryblue
        max-width 60%
        ul
            max-height 200px
            overflow auto
    .q, .a 
        span, img
            display inline-block
            vertical-align top
            margin 0 0 0 10px
        img
            width 120px
    .a img
        width 40px
    h4
        border-bottom 1px solid rgba(lighten(primaryblue, 5), 75)
        padding-bottom 10px
        width 60%
    ul
        max-height 60vh
        overflow auto    
        li
            min-width 111px
            width 95%
            line-height 1.5
            white-space normal
            .fa-close
                left -11px
            .a
                display block


</style>