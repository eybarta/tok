<template>
<div class="item-menu">
<ul class="breadcrumbs">
            <li v-for="crumb in breadCrumbs">
                <router-link class="txt-md" :key="crumb" :to="{ name: crumb.name, params:crumb.params}"><span v-html="crumb.label"></span></router-link>
            </li>
        </ul>
        <h2 v-text="title"></h2>
        <div class="block block-60">
            <transition-group name="list-complete" class="waffle waffle-4" tag="div"  appear>
                <router-link :key="item" v-for="item in currentMenuItems" class="item" :to="{ name: nextroute.name, params: { [nextroute.paramkey]: item.value }}"><span><span v-html="item.label">  </span></span></router-link>
            </transition-group>                
        </div>
</div>
           
</template>
<script>
import { categories } from '/imports/api/categories'
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
                route:state => state.route
            }),
            ...mapGetters('testsModule', [
                'currentMenuItems',
                'breadCrumbs',
                'activeCategory'
            ]),
            currentMenuType() {
                console.log('current menu > ', this.route, " :: ", this.route.name);
                let types = this.menuTypes,
                    type = this.route.name,
                    index = _.indexOf(types, type);

                    if (!!this.route.params.type && /test/gi.test(this.route.params.type)) {
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
                let paramtype = params.type;
                index = _.indexOf(menuOptions, currentRouteName);
                let next =  menuOptions[(index==menuOptions.length-1) ? 0 : ++index];

                nextRoute.name = ((!!this.route.params.category && !!this.route.params.type) || !!paramtype && (paramtype==='autotest' || paramtype==='adaptivetest')) ? this.route.params.type : next; 
                nextRoute.paramkey =  (!!this.route.params.category && !!this.route.params.type) ? 'name' : next;
                console.log("nextRoute >> ", nextRoute);
                return nextRoute;
            },
            title() {
                let menutype = this.currentMenuType,
                label,
                title = "כיצד ברצונך להתרגל?";


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
        methods: {
            ...mapActions([
                'globalStore/callPopup',
                'usersModule/dirtifyUser',
                'testsModule/updateTestMenu'
            ]),
            nextMenu() {
                let types = this.menuTypes,
                    type = this.currentMenuType,
                    index = _.indexOf(types, type);

                    
                this.currentMenuType = types[(index==types.length-1) ? 0 : ++index];
                console.log('index> ', index)
                console.log('type> ', this.currentMenuType)
            },
            itemClickHandler(value, index) {
                if (index) {
                    console.log('index> ', index);
                }
                this.updateTestMenu({ [this.currentMenuType]: value });
                this.nextMenu(); 
                
            }
        },
        components: {
            Popup
        }
    }
</script>
<style lang="stylus">
@import '~imports/client/ui/styl/variables.styl'
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
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