<template>
<div class="item-menu">
<ul class="breadcrumbs">
            <li v-for="crumb in breadCrumbs" :key="crumb">
                <router-link class="txt-md" :to="{ name: crumb.name, params:crumb.params}"><span v-html="crumb.label"></span></router-link>
            </li>
        </ul>
        <h2 v-text="title"></h2>
        <div class="block block-60">
            <transition-group v-if="!!currentMenu && !!currentMenu.items.length" name="list-complete" class="waffle waffle-3" tag="div" appear>
                <router-link :class="['item', !calcRequirement(item) ? 'disabled' : '' ]" v-for="(item, index) in currentMenu.items" :to="{ name: currentMenu.name, params: { [currentMenu.key]: item.value || item.name || index } }"  :key="index">
                    <span><span v-html="!!item.label ? item.label : (!!item.name ? item.name : activeCategory.label + ' ' + (index+1)) "></span></span>
                </router-link>
            </transition-group>                
            <h4 class="tcenter" v-else>אין אפשרויות כרגע</h4>
        </div>
</div>
           
</template>
<script>
import { testFormats, categories } from '/imports/api/categories'
import { mapState, mapActions, mapGetters } from 'vuex';
import Popup from './Popup.vue'
    export default {
        data() {
            return {
                categories,
                menuTypes: ['user', 'type', 'category', 'name'],
            }
        },
        computed: {
            ...mapState({
                user: state => state.usersModule.user,
                users: state => state.usersModule.users,
                popup: state => state.globalStore.popup,
                questionbank: state => state.testsModule.questionbank,
                route:state => state.route
            }),
            ...mapGetters('testsModule', [
                'breadCrumbs',
                'activeCategory',
                'fixedTestsList',
                'hasFixedTestsList',
                'hasHebrew',
                'hasMatrices'
            ]),
            ...mapGetters('usersModule', [
                'userTestHistory',
                'userCurrentCategoryTestHistory'
            ]),
            currentMenu() {
                let params = this.route.params;
                console.log("menu items PARAMS >> ", params);
                if (!params.format) {
                    return {
                        key: 'format',
                        name: 'format',
                        items: testFormats
                    }
                } 

                switch(params.format) {
                    case 'autotest': {
                        return !params.category
                        ?  { key: 'category', name: 'autotest', items: categories }
                        : false;
                    }
                    case 'adaptivetest': {
                        return
                        !params.category
                        ?  { key: 'category', name: 'category', items: categories }
                        : false;
                    }
                    case 'fixedtest': {

                        let menu = !params.category
                        ? { key: 'category', name: 'category', items: categories }
                        : (!params.name
                        ? { key: 'name', name: 'fixedtest', items: this.fixedTestsList }
                        : false)

                        console.log("fixedtest menu > ", menu);
                        return menu;
                    }
                    case 'testhistory': {
                        console.log("[case] testhistory >> ", params.category);
                        let menu = 
                        !params.category
                        ? { key: 'category', name: 'category', items: categories }
                        : !params.namelist
                        ? { key: 'name', name: 'testhistory', items: this.userCurrentCategoryTestHistory }
                        : false

                        console.log("menu >> ", menu);
                        return menu;
                    }
                   
                }
                console.log('wtffff');
                return false;
            },
            currentMenuType() {
                console.log('current menu > ', this.route, " :: ", this.route.name);
                let types = this.menuTypes,
                    type = this.route.name,
                    index = _.indexOf(types, type);

                    if (!!this.route.params.format && /test/gi.test(this.route.params.format)) {
                        return 'activetest'
                    }
                return types[(index==types.length-1) ? 0 : ++index];
            },
            nextroute() {
                let nextRoute, menuOptions, currentRouteName, index;
                nextRoute = {
                    paramkey: '',
                    name: ''
                }
                menuOptions = this.menuTypes;
                currentRouteName = this.route.name;

                let params = this.route.params;
                let paramtype = params.format;
                index = _.indexOf(menuOptions, currentRouteName);
                let next =  menuOptions[(index==menuOptions.length-1) ? 0 : ++index];

                nextRoute.name = ((!!this.route.params.category && !!this.route.params.format) || !!paramtype && (paramtype==='autotest' || paramtype==='adaptivetest')) ? this.route.params.format : next; 
                nextRoute.paramkey =  (!!this.route.params.category && !!this.route.params.format) ? 'name' : next;
                console.log("nextRoute >> ", nextRoute);
                return nextRoute;
            },
            title() {
                let menutype = this.currentMenuType,
                label,
                title = "כיצד ברצונך לתרגל?";


                if (menutype==='category') {
                    title = "באיזה נושא תרצו לתרגל?";
                }
                else if (menutype==='name') {
                    label = this.activeCategory.label;
                    title = "נא לבחור מה"+ label;
                }
                else if (menutype==='fixedtest') {
                    label = this.activeCategory.label;
                    title = "נא לבחור מה"+ label;
                }
                return title
            }
        },
        mounted() {
            let user = this.user;
            console.log(">> THIS USER? ", this.user);
            if (!user.profile.dirty) {
                this.callPopup({ title:'פרטים אישיים', type:'UserProfile'})
                this.dirtifyUser();
            }
            console.log("categories >> ", this.categories);
            console.log("currentMenuItems >> ", this.currentMenuItems);
        },
        created() {
            this.initQuestions();
        },
        methods: {
            ...mapActions('usersModule', [
			    'dirtifyUser'			
		    ]),
            ...mapActions('testsModule', [
                'updateTestMenu',
                'initQuestions'
            ]),
            ...mapActions('globalStore', [
                'callPopup'
            ]),
            calcRequirement(item) {
                if (!item.requirement) {
                    return true;
                }
                else {
                    console.log('item.requirement > ', item.requirement, " ;: ", this[item.requirement.toString()]);
                    return this[item.requirement];
                }
            }
        },
        components: {
            Popup
        }
    }
</script>
<style lang="stylus">
@import '~imports/styl/variables.styl'
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
{
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s;
}
.list-complete-leave-active {
  position: absolute;
}
.item
    background linear-gradient(145deg, bluegreen 0%, bluegreen 50%, darken(bluegreen, 50) 90%)
    box-shadow 4px 4px 12px rgba(darken(bluegreen, 75), 0.02)
    // border 1px solid bluegreen
    text-align center
    position relative
    border-radius 360px
    transition all 0.8s ease
    overflow hidden
    &.disabled
        opacity 0.2
        pointer-events none
    &:hover
        background-position 100px
    & > span
        box-shadow 1px 1px 2px rgba(#fff, 0.5)
        &:before
            display inline-block
            content ''
            height 100%
            vertical-align middle
        self-center()
        color darken(bluegreen, 1)
        font-size 22px
        width 99%
        height @width
        border-radius 360px
        background #fff
        & > span
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
            text-align right
.item-menu
    h2
        color darken(blue,75)
.breadcrumbs
    text-align center
    margin 5vmin auto

    li
        display inline-block
        margin 0 0 0 15px
        a
            color darken(blue, 45)
            &:after
                content: '>'
                display inline-block
                margin-right 15px
        &:first-child a
            font-size 3.5vmin
        &:last-child a
            pointer-events none
            color darken(blue, 55)
            &:after
                display none

</style>