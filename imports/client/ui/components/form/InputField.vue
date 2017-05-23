<template>
    <div :class="['field', type, focus ? 'valid' : '', !!value ? 'valid' : '']">
        <input ref="field" :value="value" type="text" @focus="focus=true" @blur="focus=false" @input="$emit('input', $event.target.value)" required>
        <i v-if="!!value" class="fa fa-close" @click.prevent="$emit('input', '')"></i>
    </div>
</template>
<script>
export default {
    props: {
        value: String, 
        placeholder: String,
        type: {
            default: '',
            type: String
        }
    },
    data() {
        return {
            focus: false
        }
    }
}
</script>
<style lang="stylus">

</style>