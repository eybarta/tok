<template>
    <div class="date-range">
        <div :class="['field','date', focus ? 'valid' : '', !!range.start ? 'valid' : '']">
            <input @focus="focus=true" @blur="focus=false" type="text" placeholder="תאריך התחלה" ref="start">
            <i v-if="!!range.start" class="fa fa-close" @click.prevent="reset('start')"></i>
        </div>
        <span> - </span>
        <div :class="['field','date', focus ? 'valid' : '', !!range.end ? 'valid' : '']">
            <input @focus="focus=true" @blur="focus=false" type="text" ref="end">
            <i v-if="!!range.end" class="fa fa-close" @click.prevent="reset('end')"></i>
        </div>
        <button @click="initUsers({ type:'date', start:range.start, end:range.end})" class="mr-small fetch-btn btn btn-primary">חפש</button>
    </div>
</template>
<script>
import Pikaday from 'pikaday';
// var Pikaday = require('pikaday');
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            focus: false,
            range: {
                start: null,
                end: null
            },
            startPicker: null,
            endPicker:null
        }
    },
    mounted() {
        this.initFilterDatePickers();
    },
    methods: {
        ...mapActions('usersModule', [
            'initUsers'
        ]),
        reset(who) {
            this.$set(this.range, who, '');
            this.$emit('input', this.range); 
            this[`${who}Picker`].setDate('')
        },
        fetch() {
            
        },
        updateStartDate(date) {
            console.log('this.startPicker >> ', this.startPicker);
            this.startPicker.setStartRange(date);
            this.endPicker.setStartRange(date);
            this.endPicker.setMinDate(date);
        },
        updateEndDate(date) {
            this.startPicker.setEndRange(date);
            this.startPicker.setMaxDate(date);
        },
        initFilterDatePickers() {
            let vm = this;
            let refs = this.$refs;
            console.log('date refs >> ', refs);
            if (!!refs) {
                this.startPicker = new Pikaday({
                    field: vm.$refs.start,
                    format: "D/M/YYYY",
                    onSelect: function() {
                        let date = this.getDate();
                        vm.$set(vm.range, 'start', this.toString("D/M/YYYY"))
                        vm.$emit('input', vm.range)
                        vm.updateStartDate(date);
                    }
                    
                })
                this.endPicker = new Pikaday({
                    field: vm.$refs.end,
                    format: "D/M/YYYY",
                    onSelect: function() {
                        let date = this.getDate();
                        vm.$set(vm.range, 'end', this.toString("D/M/YYYY"))
                        vm.$emit('input', vm.range)
                        vm.updateEndDate(date);
                    }
                })
                console.log("this.endPicker > ", this.endPicker);
            }
        },
    }
}
</script>
<style lang="stylus">

</style>