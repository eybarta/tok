<template>
<main class="admin-home">
<!--
    <img class="page-logo" src="/img/etz-logo.svg" alt="עץ הדעת">
    -->
    <div v-if="!!user" class="profile">
        <span class="profile-link"><span v-text="user.profile.name"></span><i class="fa fa-user"></i></span>
        <a class="signout" href="#p" @click.prevent="signOutUser">התנתק</a>
    </div>
    <div class="online-users">
        <h5>מחוברים עכשיו: <strong v-text="usersOnline"></strong></h5>
    </div>
    <h2 v-text="greeting"></h2>
    <ul class="admin-tabs pt-bigger">
        <router-link :to="{ name:'statistics', exact: true }" tag="li">
            <a href="">סטטיסטיקות</a>
        </router-link>
        <router-link :to="{ name:'manageUsers', exact: true }" tag="li">
            <a href="#p">ניהול משתמשים</a>
        </router-link>
        <router-link :to="{ name:'addQuestion', exact: true }" tag="li">
            <a href="#p">יצירת שאלה</a>
        </router-link>
        <router-link :to="{ name:'createTest', exact: true }" tag="li">
            <a href="#p">יצירת מבחן</a>
        </router-link>
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
import { mapActions, mapState } from 'vuex'
export default {
    methods: {
        ...mapActions('usersModule', [
            'initUsers',
            'signOutUser',
            'getOnlineUsers'
        ]),
        ...mapActions('globalStore', [
            'setNote'
        ]),
        ...mapActions('testsModule', [
            'initFixedTests',
            //temp
            'initImagesCollection'
        ])
    },
    computed: {
        ...mapState('usersModule', [
            'user',
            'usersOnline'
        ]),
        greeting() {
            return `שלום ירון, ${this.getGreetingTime}`;

        },
        getGreetingTime() {
            let g = null,
                m = moment();
            if (!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.

            var split_afternoon = 12 //24hr time to split the afternoon
            var split_evening = 17 //24hr time to split the evening
            var currentHour = parseFloat(m.format("HH"));

            if (currentHour >= split_afternoon && currentHour <= split_evening) {
                g = "צהריים טובים";
            } else if (currentHour >= split_evening) {
                g = "ערב טוב";
            } else {
                g = "בוקר טוב";
            }

            return g;
        }

    },
    created() {
        // this.initUsers();
        // console.log("set note action <<< ", this.setNote);
    },
    mounted() {
         if (!!this.user) {
            this.initFixedTests();
            this.initImagesCollection();
            this.getOnlineUsers();
        }
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/variables'
.admin-home
    background linear-gradient(to bottom, rgba(255,255,255,0.9) 5%, rgba(255,255,255,0.1) 100%)
.page-logo
    position absolute
    top 2vh
    right 3vh
    max-width 10vmin
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
            border-bottom 1px solid orange
            a
                color lighten(orange, 8)
        &:hover a
            color darken(orange, 8)
.admin-part
    margin-top -1px
    background linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%)
    min-height 73vh
    box-shadow -10px -50px 50px rgba(255, 255, 255, 1)
h2
    text-align center
    color darken(primaryblue, 5)
.online-users
    position absolute
    top 20px
    right 30px
    h5
        font-size 14px
        strong
            font-weight bold
            font-size 16px
            color darken(primaryblue, 20)
</style>