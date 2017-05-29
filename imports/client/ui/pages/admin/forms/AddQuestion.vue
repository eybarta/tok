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
        <div class="form pt-big mt-med bt-dashed clear">
            <div>
                <div v-for="(item, index) in list" :class="['qa', activeQuestionIndex===index ? 'active' : '']">
                    <button :class="[activeQuestionIndex===index ? 'min' : 'max' ]" @click="changeActiveQuestionIndex(index)" ></button>
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
                <!--
                    <dropzone 
                        class="dropzone"
                        :useFontAwesome="true"
                        :maxNumberOfFiles="1"
                        id="myVueDropzone"
                        url="https://httpbin.org/post"
                        :language="{dictDefaultMessage:'זרוק פה קובץ'}"
                        @vdropzone-success="fileDropped">
                        // Optional parameters if any! 
                        <input type="hidden" name="token" value="xxx">
                    </dropzone>
                -->
                <!--
                <div class="test-images">
                    <div v-for="image in images">
                        <div v-if="!!image.uploading">
                            <span>UPLOADING</span>
                        </div>
                        <div v-else>
                            <img :src="image.url" :title="image.name">
                        </div>
                    </div>
                </div>
                -->
                <div v-if="!!uploader" class="dropzone" @click="uploadFile($event)">
                    <img v-if="!!previewimage" class="preview-image" :src="previewimage" alt="">
                    <div class="upload" v-else>
                        <img v-if="!!uploading" class="loader-icon spinning-cog hidden" src="/img/cog-loader.svg" data-cog="cog02">
                        <i v-else class="fa fa-upload"></i>
                        <span v-text="!!uploading ? 'מעלה קובץ...' : 'להעלות תמונה'"></span>
                    </div>
                </div>
            </div>            
        </div>
        <div class="">
            <button @click="save" :class="['btn', 'btn-success-inverse', !validQuestionEntry ? 'disabled' : '']">שמור</button>
            <button @click="anotherQuestion" :class="['btn', 'btn-success-inverse', !validQuestionEntry ? 'disabled' : '']">שמור והוסף שאלה<i class="fa fa-plus-circle pr-small"></i></button>
        </div>
    </div>
</div>
</template>
<script>
import { ImageStore } from '/imports/api/collections/images';
import {UploadFS} from 'meteor/jalik:ufs';
import { categories } from '/imports/api/categories'
// import Dropzone from '/imports/client/ui/components/vue2-dropzone/index.vue'
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
            previewimage: null

        }
    },
    created() {
        this.initQuestions();
        
        
    },
    watch: {
        activesubcat: {
            handler() {
                if (!!this.activesubcat && this.activesubcat.value==='comprehension') {
                    this.uploader = true;
                    this.$set(this, 'list', [_.merge({ imageUrl: null}, _.cloneDeep(questionObj))])
                }
            }
        }
    },
    components: {
    //   Dropzone
    },
    methods: {
        ...mapActions('testsModule', [
            'saveQuestion',
            'initQuestions'
        ]),
        minimizeQuestion() {

        },
        changeActiveQuestionIndex(index) {
            console.log('change question index> ', index);
            this.$set(this, 'activeQuestionIndex',index)
        },
        uploadFile(e) {
            let vm = this;
            UploadFS.selectFiles(function (file) {
            // Prepare the file to insert in database, note that we don't provide a URL,
            // it will be set automatically by the uploader when file transfer is complete.

                // Preview image in UI
                // vm.previewimage = window.URL.createObjectURL(file);
                // Get image natural dimensions
                let dimensions = vm.imageDimensions;

                
                
                URL.createObjectURL(file);
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
                            vm.$set(vm, 'previewimage', file.url);
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
                    vm.$set(vm, 'uploading', true);
                    
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
            let firstQuestion = this.list[0];
            return !!firstQuestion.question 
                && _.compact(firstQuestion.answers).length===firstQuestion.answers.length
                && !!this.activesubcat && this.activesubcat.value;
        },
        imageDimensions() {
            if (!!this.previewimage) {
                return {
                    width: this.previewimage.naturalWidth,
                    height: this.previewimage.naturalHeight,
                }
            }
            return null;
        },
        ...mapState('testsModule', [
            'images'
        ])
    }
}
</script>
<style lang="stylus">
@import '~imports/client/ui/styl/variables.styl'
@import '~imports/client/ui/styl/settings'
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all .2s
  transform: scale(1)
}
.fade-slide-enter, .fade-slide-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
  transform: scale(0.2)
}
.qa
    position relative
    padding 30px 20px
    border-right 1px solid lighten(gray, 45)
    background rgba(bluegreen 0.01)
    max-height 30px
    transition max-height 400ms ease-out
    border-bottom 1px dotted lighten(gray, 45)
    for num in (1...5)
        &:nth-child({num})
            &:after
                content 'שאלה ' +num
                position absolute
                top 50%
                right 5%
                transform translateY(-50%) 
    &.active
        max-height 600px
        border-bottom 0
        border-radius 0 0 0 12px
        &:after
         content none
    .min, .max
        position absolute
        top 10px
        right -40px
        font-size 22px
        background none
        border 0
        cursor pointer
        color lighten(gray, 20)
        outline none
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
        max-width 600px
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
.test-images
    img
        max-width 200px            
</style>