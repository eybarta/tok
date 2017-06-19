<template>
<div class="add-users-form">
    <div v-if="!loading && !userLogins">
        <div class="form">
            <input placeholder="הזן תאריך" ref="datepicker" v-model="date" @change="dateChange($event)" type="text">
            <textarea v-model="rawStringIds" cols="30" rows="10"></textarea>
        </div>
        <div class="tleft mtbase">
            <button @click="save({ date, userIds})" class="btn btn-success">לשמור
            </button>
        </div>
    </div>
    <preloader v-if="loading" pretitle="שומר משתמשים חדשים..."></preloader>
</div>
</template>
<script>
if (Meteor.isClient) {
    var Pikaday = require('pikaday');
}
import Preloader from '/imports/client/ui/components/Preloader.vue'
import { mapActions, mapState } from 'vuex'
export default {
    data() {
        return {
            date: null,
            rawStringIds: '',
            loading: false,
        }
    },
    components: {
       Preloader
    },
    mounted() {
        let ref = this;
        new Pikaday({ 
            field: ref.$refs.datepicker,
            format: 'D/M/YYYY' 
        });
    },
    methods: {
        ...mapActions('usersModule',[
            'saveUsers'
        ]),
        save() {
            let date = this.date,
                userIds = this.userIds;
            this.$set(this, 'loading', true);
            this.saveUsers({date, userIds});
        },
        dateChange(e) {
            this.$set(this, 'date', e.target.value)
        }
    },
    computed: {
        userIds() {
            let string = this.rawStringIds.replace(/\s/g, '');
            return string.split(',')
        },
        ...mapState('usersModule', [
            'userLogins'
        ])
    }
}
</script>
<style lang="stylus" scoped>
@import '~imports/client/ui/styl/variables.styl'
.preloader
    position absolute 0 0 0 0
    background #fff

.add-users-form
    .form
        padding 30px 0
        input,textarea
            font-family 'Alef Regular'
            width 100%
            height 40px
            border-radius 7px
            border 1px solid bluegreen
            outline 0
            box-shadow none
            padding 0 2%
            font-size 18px
            color darken(darkgray, 25)
        textarea
            height auto
            min-height 80px
            padding 2%
            margin 20px 0
</style>