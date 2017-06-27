<template>
<div class="add-question">
    <ul class="submenu choose-category">
        <li v-for="category in filteredCategories" :class="[!!activecat && activecat.value==category.value ? 'active' : '']">
            <a href="#p" @click.prevent="updateActiveCat(category)">{{category.label}}</a>
        </li>
    </ul>
    <div v-if="!!activecat" class="active-tab clearfix">
        <div v-if="!!log" class="log-msg">
            <h5 v-text="logMsg"></h5>
            <button @click="log=false;logMsg=null" class="btn btn-success" v-text="'הוסף עוד שאלה או שאלות ב' + activecat.label"></button>
        </div>
        <div v-else>
            <multiselect v-if="!!activecat.children && activecat.children.length" class="dropdown w-elastic-30 maxw-300" v-model="activesubcat" track-by="value" label="label" placeholder="תבחר סוג שאלה"
                        :options="activecat.children"
                        :show-labels="false"
                        :searchable="false"
                        :close-on-select="true"
                        :allow-empty="false"></multiselect>
            <button @click="save" :class="['btn', 'btn-success', 'mr-min', !validQuestionEntry ? 'disabled' : '']">שמור</button>
            <div class="form pt-big mt-med bt-dashed clear">
                <div v-if="activecat.value==='matrices'">
                    <div v-for="(item, itemindex) in list" :class="['qa', activeQuestionIndex===itemindex ? 'active' : '']">
                        <button v-if="list.length>1" :class="[activeQuestionIndex===itemindex ? 'min' : 'max' ]" @click="changeActiveQuestionIndex(itemindex)" ><span></span></button>
                        <transition name="fade-slide">
                            <div v-if="activeQuestionIndex===itemindex">
                                <div class="form-full block">
                                    <div v-for="(answer, index) in item.answers" class="field upload flb w-elastic-50 maxw-500" @click="uploadFile('answer', [itemindex, index], $event)">
                                        <img v-if="!!answer" :src="answer" alt="">
                                        <input :value="answer" type="text">
                                        <label :for="'answer'+index" class="dots" v-text="index===0 ? 'תשובה נכונה' : 'עוד תשובה'"></label>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <div v-else>
                    <div v-for="(item, index) in list" :class="['qa', activeQuestionIndex===index ? 'active' : '']">
                        <button v-if="list.length>1" :class="[activeQuestionIndex===index ? 'min' : 'max' ]" @click="changeActiveQuestionIndex(index)" ><span></span></button>
                        <transition name="fade-slide">
                            <div v-if="activeQuestionIndex===index">
                                <div class="field flb w-elastic-50 maxw-500 pb-big">
                                    <textarea id="question" class="reg w-100" v-model="item.question" type="text" required></textarea>
                                    <label for="question">שאלה</label>
                                </div>
                                <div class="form-full block">
                                    <div v-for="(answer, index) in item.answers" class="field flb w-elastic-50 maxw-500">
                                        <input :id="'answer'+index" class="reg w-100" v-model="item.answers[index]" type="text" required>
                                        <label :for="'answer'+index" class="dots" v-text="index===0 ? 'תשובה נכונה' : 'עוד תשובה'"></label>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        
                    </div>
                </div>
                <div class="pt-small">
                    <div v-if="!!uploader" class="dropzone" @click="uploadFile('uploader', null, $event)">
                        <img ref="preview" v-if="!!previewimage" class="preview-image" :src="previewimage" alt="">
                        <div class="upload" v-else>
                            <img v-if="!!uploading" class="loader-icon spinning-cog hidden" src="/img/cog-loader.svg" data-cog="cog02">
                            <i v-else :class="['fa', activecat.value==='matrices' ? ' fa-th' : 'fa-upload']"></i>
                            <span v-text="!!uploading ? 'מעלה קובץ...' : activecat.value==='matrices' ? 'העלת מטריצה' : 'להעלות תמונה'"></span>
                        </div>
                    </div>
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
import { ImageStore } from '/imports/api/collections/images';
import {UploadFS} from 'meteor/jalik:ufs';
import { categories } from '/imports/api/categories'
import { mapActions, mapState } from 'vuex';

const questionObj = {
    question: null,
    answers: [
        null,
        null,
        null,
        null
    ],
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
            logMsg: null
        }
    },
    created() {
        this.initQuestions();
        this.$set(this, 'activecat', null);
        console.log();
        
    },
    watch: {
        'activecat'() {
            if (!!this.activecat && this.activecat.value==='matrices') {
                this.$set(this, 'uploader', true);
                let q = _.cloneDeep(questionObj);
                q.answers = q.answers.concat([null,null,null,null]);
                this.$set(this, 'list', [q]);
            }
            else {
                this.$set(this, 'uploader', false);
            }
        },
        'activesubcat'() {
            if (!!this.activesubcat && this.activesubcat.value==='comprehension') {
                this.uploader = true;
                this.$set(this, 'list', [_.merge({ imageUrl: null}, _.cloneDeep(questionObj))])
            }
            else {
                this.$set(this, 'uploader', false);
            }
        }
    },
    methods: {
        ...mapActions('testsModule', [
            'saveQuestion',
            'initQuestions'
        ]),
        updateActiveCat(category) {
            this.$set(this, 'activecat', category);
        },
        changeActiveQuestionIndex(index) {
            console.log('change question index> ', index);
            this.$set(this, 'activeQuestionIndex',index)
        },
        uploadFile(from, target, e) {
            let vm = this;
            UploadFS.selectFiles(function (file) {
            // Prepare the file to insert in database, note that we don't provide a URL,
            // it will be set automatically by the uploader when file transfer is complete.

                // Preview image in UI
                // vm.previewimage = window.URL.createObjectURL(file);
                // // Get image natural dimensions
                // let dimensions = vm.imageDimensions;

                
                // console.log("dimensions >> ", dimensions);
                // URL.createObjectURL(file);
                let image = {
                    name: file.name,
                    size: file.size,
                    type: file.type
                };

            // Create a new Uploader for this file
            let uploader = new UploadFS.Uploader({
                // This is where the uploader will save the file
                // since v0.6.7, you can pass the store instance or the store name directly
                store: ImageStore || 'photos',
                // Optimize speed transfer by increasing/decreasing chunk size automatically
                adaptive: true,
                // Define the upload capacity (if upload speed is 1MB/s, then it will try to maintain upload at 80%, so 800KB/s)
                // (used only if adaptive = true)
                capacity: 0.8, // 80%
                // The size of each chunk sent to the server
                chunkSize: 1000 * 1024, // 8k
                // The max chunk size (used only if adaptive = true)
                maxChunkSize: 1000 * 1024, // 128k
                // This tells how many tries to do if an error occurs during upload
                maxTries: 5,
                // The File/Blob object containing the data
                data: file,
                // The document to save in the collection
                file: image,
                // The error callback
                onError(err, file) {
                    console.error(err);
                },
                onAbort(file) {
                    alert('הייתה תקלה... נסה שוב');
                    vm.uploading = false;
                    console.log(file.name + ' upload has been aborted');
                },
                onComplete(file) {
                    console.log(JSON.stringify(file) + ' has been uploaded');
                    setTimeout(function() {
                        vm.$nextTick(function() {
                            console.log("FROM ?? ", from);
                            if (from==='uploader') {
                                vm.$set(vm, 'previewimage', file.url);
                            }
                            else if (from==='answer') {
                                console.log("target >> ", target);
                                // let answers = vm.list[target[0]]['answers'];
                                // answers[target[1]] = file.url;
                                // let item = vm.list[target[0]];
                                // item.answers = answers;
                                let list = vm.list;
                                list[target[0]]['answers'][target[1]] = file.url;
                                vm.$set(vm, 'list', list);
                                
                            }
                        })
                        vm.$set(vm, 'uploading', false);
                    }, 1000)

                },
                onCreate(file) {
                    console.log(file.name + ' has been created with ID ' + file._id);
                },
                onProgress(file, progress) {
                    console.log(file.name + ' ' + (progress*100) + '% uploaded');
                },
                onStart(file) {
                    console.log(file.name + ' started');
                    if (from=='uploader') {
                        vm.$set(vm, 'uploading', true);
                    }
                    // else if(from=='answer') {

                    // }
                    
                },
                onStop(file) {
                    console.log(file.name + ' stopped');
                },
            });

            // Starts the upload
            uploader.start();

            // Stops the upload
            // uploader.stop();

            // Abort the upload
            // uploader.abort();
            })
        },
        fileDropped(res) {
            console.log("File dropped>> ", res);
        },
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
                questions: this.list,
                imageUrl: this.previewimage
                // answers: this.answers
            }

            let result = this.saveQuestion(data);

            console.log("RESULT >> ", result)

            this.reset();

        },
        anotherQuestion() {
            console.log('add another question >> ', questionObj);
            this.list.push(_.cloneDeep(questionObj));
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
        filteredCategories() {
            return _.filter(categories, category => { return category.value!='series'} )
        },
        validQuestionEntry() {
            let firstQuestion = this.list[0];
            return !!firstQuestion.question 
                && _.compact(firstQuestion.answers).length===firstQuestion.answers.length
                && !!this.activesubcat && this.activesubcat.value;
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
    height 100%
    border-radius 9px
    text-align center
    min-height 44vh
    position relative
    cursor pointer
    background lighten(gray, 85)
    border 1px solid lighten(gray, 80)
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
.log-msg
    self-center()
    text-align center
    h5
        font-size 26px
        padding-bottom 30px    
</style>