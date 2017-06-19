<template>
<main class="admin-home">
    <h2>מה נשמע בוס?</h2>
    <ul class="admin-tabs pt-bigger">
        <router-link :to="{ name:'manageUsers', exact: true }" tag="li">
            <a href="#p">ניהול משתמשים</a>
        </router-link>
        <router-link :to="{ name:'addQuestion', exact: true }" tag="li">
            <a href="#p">יצירת שאלה</a></li>
        </router-link>
        <router-link :to="{ name:'createTest', exact: true }" tag="li">
            <a href="#p">יצירת מבחן</a></li>
        </router-link>
        <li><a href="">סטטיסטיקות</a></li>
        <!--
        <router-link tag="li">
            <a href="#p" class="tab-link">סטטיסטיקות</a>            
        </router-link>
        -->
    </ul>
    <div class="admin-part">
        <router-view></router-view>
    </div>
</main>
</template>
<script>
import { mapActions } from 'vuex'
    export default {
        
    }
</script>
<style lang="stylus">
@import '~imports/client/ui/styl/variables'

.admin-tabs
    text-align center
    word-spacing -4px   
    li
        display inline-block
        padding 0 20px 5px
        margin 0
        word-spacing normal
        transition border 400ms ease-out, color 200ms ease-out
        a
            color gray
        &.router-link-active
            border-bottom 1px solid bluegreen
            a
                color darken(bluegreen, 8)
        &:hover a
            color darken(bluegreen, 8)
.admin-part
    padding-top 40px

h2
    text-align center
    font-size responsive 24px 30px
</style>