<template>
    <label :class="['field', type, focus ? 'valid' : '', !!value ? 'valid' : '']">
        <input ref="field" type="file" @focus="focus=true" @blur="focus=false" @change="uploadToCloud($event)" required>
        <i v-if="!!value" class="fa fa-close x-btn" @click.prevent="deleteFromCloud()"></i>
        <span class="placeholder" v-text="placeholder"></span>

        <div class="preview">
            <i v-if="!!inprogress" class="fa fa-spinner fa-spin progress"></i>
            <img v-if="preview" :src="preview" alt="">
        </div>
        <input :value="value" type="text" hidden>
    </label>
</template>
<script>
export default {
    props: {
        value: String, 
        placeholder: {
            type:String,
            default: 'העלת קובץ'
        },
        type: {
            default: '',
            type: String
        }
    },
    data() {
        return {
            focus: false,
            clientfile: null,
            cloudfile: null,
            inprogress:false,
            preview: null
            
        }
    },
    methods: {
        uploadToCloud(e) {
            let vm = this;
            let files = e.currentTarget.files;
            console.log('target > ', e.currentTarget.files[0]);
            this.$set(this, 'clientfile', files[0])
            this.$set(this, 'placeholder', files[0].name);
            this.$set(this, 'inprogress', true);
            
            Cloudinary.upload(files, {
                eager: [{ width: 600, crop: "fit" }], 
                use_filename: true,
                unique_filename: false,
                resource_type: 'image'    
            },(err,res) => {
                console.log('res.. ', res, err)

                 vm.$set(vm, 'inprogress', false);
                if (!err) {
                    vm.$set(vm, 'preview', window.URL.createObjectURL(vm.clientfile));
                    vm.$set(vm, 'cloudfile', res);
                    vm.$emit('input', res.url);
                }
            })
        },
        deleteFromCloud() {
            let vm = this;
            vm.$set(vm, 'inprogress', true);
            vm.$set(vm, 'preview', null);
            Cloudinary.delete(this.cloudfile.public_id, (err, res) => {
                console.log("file deleted... ", err, res);
                vm.$set(vm, 'inprogress', false);
                vm.$set(vm, 'cloudfile', null);
                vm.$emit('input', '');
            })
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~imports/styl/variables.styl';
@import '~imports/styl/settings.styl';
label
    position relative
    overflow hidden
    border-bottom 1px solid rgba(primaryblue, 0.4)
    padding-left 50px
    height 50px
    margin-bottom 10px !important
    .fa-close
        top 13%
        left 9%
        padding 1%
        background rgba(#fff, 0.3)

    .placeholder
        position absolute
        right 1%
        top 50%
        transform translate(0,-50%)
        color lighten(gray, 60)
    
    .preview
        border 1px solid lighten(gray, 83)
        border-radius 10px
        width 40px
        height 40px
        overflow hidden
        position absolute
        left 0
        top 50%
        transform translateY(-50%)
        img
            width 94%
            self-center()
    .progress
        position absolute
        top 33%
        left 30%
        opacity 0.15
    input 
        position absolute
        top -200%
</style>