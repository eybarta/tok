<template>
    <div :class="['note', !!note.active ? 'active' : '', note.type]">
        <i v-if="!!note.type" :class="['fa', note.type==='success' ? 'fa-check' : '']"></i>
        <span v-if="!!note.message" v-text="note.message"></span>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    // props:['title', 'content', 'timer'],
    computed: {
        ...mapState('globalStore', [
            'note'
        ])
    },
    methods: {
        ...mapActions('globalStore', [
            'setNote'
        ])
    },
    mounted() {
        Meteor.setTimeout(function() {
            this.setNote(false);
        }.bind(this), this.note.timer)
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/variables.styl'

.note
    position fixed
    top 0
    left 50%
    padding 45px 60px 30px
    transform translate(-50%, -15px)
    background #fff
    border 1px solid rgba(lighten(bluegreen, 10), 0.1)
    box-shadow 2px 2px 6px rgba(black, 0.15)
    border-radius 2px
    // &.active
        // transform translate(-50%, -15px)
        
    &.success
        color darken(bluegreen, 1)
        background rgba(darken(bluegreen, 5), 0.005)  
        

.note-fly-enter-active,
.note-fly-leave-active
    transition transform 400ms cubic-bezier(0.125, 0.585, 0.22, 1.1), opacity 400ms cubic-bezier(0.125, 0.585, 0.22, 1.1)
.note-fly-enter
    transform translate(-50%,-100px)
    opacity 0
.note-fly-enter-to
    transform translate(-50%, -15px)
    opacity 1
.note-fly-leave
    transform translate(-50%, -15px)
    opacity 1
.note-fly-leave-to
    transform translate(-50%,-100px)
    opacity 0
</style>