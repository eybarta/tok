<template>
<div class="profile-form">
    <ul class="form">
        <li>
            <input required v-model="name" type="text" id="name">
            <label for="name">שם מלא</label>
        </li>
        <li>
            <input required v-model="email" type="text" id="email">
            <label for="email">כתובת אימייל</label>
        </li>
        <li>
            <input required v-model="phone" type="text" id="phone">
            <label for="phone">מספר טלפון</label>
        </li>
        <li>
            <input required v-model="city" type="text" id="city">
            <label for="city">אזור מגורים</label>
        </li>
        <li>
            <input required v-model="dob" type="text" id="dob">
            <label for="dob">תאריך לידה</label>
        </li>
        <li>
            <select name="" id="yearsOfEducation" v-model="education.years">
                <option v-for="i in 13" :value="i">{{i}}</option>
            </select>
            <label for="yearsOfEducation">שנות לימוד</label>
        </li>
    </ul>
</div>
</template>
<script>
    export default {
        data() {
            return {
                name: null,
                email: null,
                phone: null,
                city: null,
                dob:null,
                education: {
                    years: null,
                    higher: null
                }

            }
        }
    }
</script>
<style lang="stylus">
.form
    padding-top 60px
    li
        display block
        padding 0 0 40px
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