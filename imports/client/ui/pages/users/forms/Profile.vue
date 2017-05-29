<template>
<div class="profile-form pt-med">
    <div class="form-wrap">
        <div class="bb-dashed pt-big pb-med parent-50 form" v-if="isAdmin">
            <div class="field-select  pb-0 mb-med">
                <multiselect v-model="profile.status" 
                    track-by="value"
                    label="label"
                    :class="[!!profile.status ? 'unempty' : '']"
                    :options="userOptions.status"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    :allow-empty="false"></multiselect>
                <label for="status">סטטוס</label>
            </div>
            <div class="field flb date pb-0 mb-med">
                <input required v-model="profile.group" ref="grouppicker" @change="profile.group = $event.target.value" type="text" id="group">
                <label for="group">קבוצה</label>
            </div>
        </div>
        <ul class="form parent-col-6 pt-big">
            
            <li class="field flb">
                <input required v-model="profile.name" type="text" id="name">
                <label for="name">שם מלא</label>
            </li>
            <li class="field flb">
                <input required v-model="profile.email" type="text" id="email">
                <label for="email">כתובת אימייל</label>
            </li>
            <li class="field flb">
                <input required v-model="profile.phone" type="text" id="phone">
                <label for="phone">מספר טלפון</label>
            </li>
            <li class="field flb">
                <input required v-model="profile.city" type="text" id="city">
                <label for="city">אזור מגורים</label>
            </li>
            <li class="field flb">
                <div class="field-select">
                    <multiselect 
                        v-model="profile.education.years"
                        :class="[!!profile.education.years ? 'unempty' : '']"
                        placeholder=""
                        :options="educationyearsOptions"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        :allow-empty="false"></multiselect>
                    <label for="yearsOfEducation">שנות לימוד</label>
                </div>
            </li>
            <li class="field flb">
                <div class="field-select">
                    <multiselect 
                        v-model="profile.education.higher"
                        :class="[!!profile.education.higher ? 'unempty' : '']"
                        placeholder=""
                        track-by="value"
                        label="label"
                        :options="higherEducationOptions"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        :allow-empty="false"></multiselect>
                    <label for="yearsOfEducation">לימודים גבוהים</label>
                </div>
            </li>
            <li class="field-date flb">
                <input required v-model="profile.dob" ref="dobpicker" @change="profile.dob = $event.target.value" type="text" id="dob">
                <label for="dob">תאריך לידה</label>
            </li>
            
        </ul>
    </div>
    <button @click="saveUserProfile({profile, userId})" class="btn btn-success">שמור</button>
</div>
</template>
<script>
if (Meteor.isClient) {
    var Pikaday = require('pikaday');
}
import { userOptions } from '/imports/api/userConstants'
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
                group: null,
                education: {
                    years: null,
                    higher:null,
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
            field: ref.$refs.dobpicker,
            format: 'D/M/YYYY',
            yearRange: [1900,2005]
        });
         new Pikaday({ 
            field: ref.$refs.grouppicker,
            format: 'D/M/YYYY',
        });
        if (!!this.moredata && _.has(this.moredata, 'profile')) {
            // Admin is editing user
            this.$set(this, 'userId', this.moredata._id)
            _.merge(this.profile, this.moredata.profile)
            this.$set(this.profile, 'status', this.moredata.profile.status)
        }
        else {
            // User is editing himself
            
            _.merge(this.profile, this.user.profile)
        }

        console.log('isAdmin > ', this.isAdmin);
    },
    methods: {
        ...mapActions('usersModule', [
            'saveUserProfile'
        ])
    },
    computed: {
        ...mapState('usersModule', [
            'user'
        ]),
        ...mapGetters('usersModule', [
            'isAdmin'
        ]),
        educationyearsOptions() {
            return [...Array(13).keys()]
        },
        higherEducationOptions() {
            return [
                {
                    label:'תואר ראשון',
                    value:'ba'
                },
                {
                    label:'תואר שני',
                    value:'master'
                },
                {
                    label:'דוקטורט',
                    value:'doctorate'
                },
                {
                    label:'תעודה מקצעוית',
                    value:'professional'
                },
            ]
        }
    }
}
</script>

<style lang="stylus" scoped>

        
        // input 
        //     width 100%
        //     transition background 400ms ease-out
        //     & + label
        //         display inline-block
        //         position absolute
        //         transform translate(-15%, -30px)
        //         color lighten(gray, 30)
        //         font-size 18px
        //         transition transform 200ms ease-out, color 200ms ease-out, font-size 200ms ease-out
        //     &:focus, &:valid
        //         & + label
        //             transform translate(0, -56px)
        //             font-size 12px
        //             color darken(gray, 10)
        //             &:after
        //                 content ':'
        //                 display inline-block
        //     &:valid
        //         background rgba(#0bddbe, 0.02)
</style>