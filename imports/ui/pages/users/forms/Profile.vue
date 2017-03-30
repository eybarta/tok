<template>
<div class="profile-form">
    <ul class="form">
        <li>
            <input required v-model="profile.name" type="text" id="name">
            <label for="name">שם מלא</label>
        </li>
        <li>
            <input required v-model="profile.email" type="text" id="email">
            <label for="email">כתובת אימייל</label>
        </li>
        <li>
            <input required v-model="profile.phone" type="text" id="phone">
            <label for="phone">מספר טלפון</label>
        </li>
        <li>
            <input required v-model="profile.city" type="text" id="city">
            <label for="city">אזור מגורים</label>
        </li>
        <li>
            <input required v-model="profile.dob" ref="datepicker" @change="profile.dob = $event.target.value" type="text" id="dob">
            <label for="dob">תאריך לידה</label>
        </li>
        <li>
            <label for="yearsOfEducation">שנות לימוד</label>
            <select name="" id="yearsOfEducation" v-model="profile.education.years">
                <option v-for="i in 12" :value="i">{{i}}</option>
            </select>
        </li>
        <li v-if="isAdmin">
            <label for="status">סטטוס</label>
            <multiselect v-model="profile.status" track-by="value" label="label" placeholder="מה הסטטוס?"
                    :options="userOptions.status"
                    :searchable="false"
                    :close-on-select="true"
                    :allow-empty="false"></multiselect>
        </li>
    </ul>
    <button @click="saveUserProfile({profile, userId})" class="btn btn-success">שמור</button>
</div>
</template>
<script>
import { userOptions } from '/imports/api/userConstants'

import Multiselect from '/imports/ui/components/vue-multiselect/src/Multiselect.vue'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
    props: ['moredata'],
    data() {
        return {
            userOptions,
            userId: null,
            profile: {
                name: null,
                email: null,
                phone: null,
                city: null,
                dob:null,
                education: {
                    years: null,
                    higher: null
                },
                status: {
                    label: null,
                    value: null
                }
            }
        }
    },
    mounted() {
        let ref = this;
        new Pikaday({ 
            field: ref.$refs.datepicker,
            format: 'D/M/YYYY',
            yearRange: [1900,2005]
        });
        if (!!this.moredata && _.has(this.moredata, 'profile')) {
            // Admin is editing user
            this.$set(this, 'userId', this.moredata._id)
            _.merge(this.profile, this.moredata.profile)
        }
        else {
            // User is editing himself
            
            _.merge(this.profile, this.user.profile)
        }
    },
    components: {
        Multiselect
    },
    methods: {
        ...mapActions([
            'usersModule/saveUserProfile'
        ])
    },
    computed: {
        ...mapState('usersModule', [
            'user'
        ]),
        ...mapGetters('globalStore', [
            'isAdmin'
        ])
    }
}
</script>
<style lang="stylus">
.form
    padding-top 60px
    & > li
        display block
        padding 0 0 22px
        input 
            transition background 400ms ease-out
            & + label
                display inline-block
                position relative
                transform translate(-15%, -30px)
                color gray
                font-size 18px
                transition transform 200ms ease-out, color 200ms ease-out
            &:focus, &:valid
                & + label
                    transform translate(0, -65px)
                    color darken(gray, 40)
            &:valid
                background rgba(#0bddbe, 0.02)
</style>