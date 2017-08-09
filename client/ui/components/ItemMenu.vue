<template>
<div class="item-menu">
<ul class="breadcrumbs">
            <li v-for="crumb in breadCrumbs" :key="crumb">
                <router-link class="txt-md" :to="{ name: crumb.name, params:crumb.params}"><span v-html="crumb.label"></span></router-link>
            </li>
        </ul>
        <h2 v-text="title"></h2>
        <div class="block tcenter center w-80">
            <transition-group v-if="!!currentMenu && !!currentMenu.items.length" name="list-complete" class="menu-list" tag="div" appear>
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
            route: state => state.route
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
            let menu;
            console.log("menu items PARAMS >> ", params);
            if (!params.format) {
                menu = {
                    key: 'format',
                    name: 'format',
                    items: testFormats
                }
            }

            switch (params.format) {
                case 'autotest': {
                    menu = !params.category
                        ? { key: 'category', name: 'autotest', items: categories }
                        : false;
                    break;
                }
                case 'adaptivetest': {
                    menu = !params.category
                        ? { key: 'category', name: 'category', items: categories }
                        : false;
                    break;
                }
                case 'fixedtest': {

                    menu = !params.category
                        ? { key: 'category', name: 'category', items: categories }
                        : (!params.name
                            ? { key: 'name', name: 'fixedtest', items: this.fixedTestsList }
                            : false)
                    break;
                }
                case 'testhistory': {
                    menu = !params.category
                        ? { key: 'category', name: 'category', items: categories }
                        : !params.namelist
                            ? { key: 'name', name: 'testhistory', items: this.userCurrentCategoryTestHistory }
                            : false
                    break;
                }
            }
            console.log("[MENU] menu > ", menu);
            console.log("[MENU] ordered menu > ", _.orderBy(menu, 'active'));
            return menu //!!menu ? _.orderBy(menu, 'active') : false;
        },
        currentMenuType() {
            let types = this.menuTypes,
                type = this.route.name,
                index = _.indexOf(types, type);

            if (!!this.route.params.format && /test/gi.test(this.route.params.format)) {
                return 'activetest'
            }
            console.log('current menu type > ', types[(index == types.length - 1) ? 0 : ++index]);
            return types[(index == types.length - 1) ? 0 : ++index];
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
            let next = menuOptions[(index == menuOptions.length - 1) ? 0 : ++index];

            nextRoute.name = ((!!this.route.params.category && !!this.route.params.format) || !!paramtype && (paramtype === 'autotest' || paramtype === 'adaptivetest')) ? this.route.params.format : next;
            nextRoute.paramkey = (!!this.route.params.category && !!this.route.params.format) ? 'name' : next;
            console.log("nextRoute >> ", nextRoute);
            return nextRoute;
        },
        title() {
            let menutype = this.currentMenuType,
                label,
                title = "כיצד ברצונך לתרגל?";


            if (menutype === 'category') {
                title = "באיזה נושא תרצו לתרגל?";
            }
            else if (menutype === 'name') {
                label = this.activeCategory.label;
                title = "נא לבחור מה" + label;
            }
            else if (menutype === 'fixedtest') {
                label = this.activeCategory.label;
                title = "נא לבחור מה" + label;
            }
            return title
        }
    },
    mounted() {
        let user = this.user;
        console.log(">> THIS USER? ", this.user);
        if (!user.profile.dirty) {
            this.callPopup({ title: 'פרטים אישיים', type: 'UserProfile' })
            this.dirtifyUser();
        }
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
                item.active = true;
                return true;
            }
            else {
                console.log('item.requirement > ', item.requirement, " ;: ", this[item.requirement.toString()]);
                item.active = false;
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
@import '~imports/styl/settings.styl'
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

.item-menu
    background linear-gradient(to bottom, rgba(lightgray,1) 0%,rgba(lightgray,1) 29%,rgba(lightgray,0) 68%,rgba(lightgray,0) 100%)
    h2
        color darken(blue,75)
        +below(540px)
            margin-top 6vh
.menu-list
    text-align right
    display inline-block
    .item
        display inline-block
        width 16vmin
        height @width
        border-radius unit(@width/2, 'vmin')
        margin 0 0 15px 15px
        background linear-gradient(145deg, primaryblue 0%, primaryblue 50%, darken(primaryblue, 50) 90%)
        box-shadow 4px 4px 12px rgba(darken(primaryblue, 75), 0.02)
        text-align center
        position relative
        transition all 0.8s ease
        overflow hidden
        +below(420px)
            width 16vmax
            height @width
            border-radius unit(@width/2, 'vmax')

        &.disabled
            opacity 0.2
            pointer-events none

        & > span
            self-center()
            box-shadow 1px 1px 2px rgba(#fff, 0.5)
            &:before
                display inline-block
                content ''
                height 100%
                vertical-align middle
            self-center()
            color darken(primaryblue, 1)
            font-size 21px
            width 99%
            height @width
            border-radius 360px
            background mix(#fff, lightgray, 55)
            transition background 300ms ease
            +below(420px)
                font-size 16px
            & > span
                position absolute
                top 50%
                left 50%
                transform translate(-50%, -50%)
                text-align right
        &:hover
            background-position 100px
            & > span
                background mix(#fff, lightgray, 75)
.breadcrumbs
    text-align center
    padding 5vmin

    li
        display inline-block
        margin 0 0 0 15px
        a
            color darken(blue, 45)
            font-size 22px
            +below(540px)
                font-size 16px
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