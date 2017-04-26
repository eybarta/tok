<template>
<div class="users-home">
    <main>
        <router-view></router-view>
    </main>
    
</div>
</template>
<script>
import { categories } from '/imports/api/categories'
import { mapState, mapActions, mapGetters } from 'vuex';
import Popup from '../../components/Popup.vue'
    export default {
        data() {
            return {
                categories,
                menuTypes: ['type', 'category', 'activepractice'],
            }
        },
        mounted() {
            let user = this.user;
            console.log("FROM USER HOME >> ", this.user)
            if (!!user && !user.profile.dirty) {
                this.callPopup({ title:'פרטים אישיים', type:'UserProfile'})
                this.dirtifyUser();
            }
            console.log("categories >> ", this.categories);
            console.log("currentMenuItems >> ", this.currentMenuItems);
        },
        computed: {
            ...mapState('usersModule', [
                'user',
                'users'
            ]),
            ...mapState([
                'route'
            ]),
            ...mapState('testsModule', [
                'testMenu'
            ]),
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

                return types[(index==types.length-1) ? 0 : ++index];
            },
            title() {
                let label,
                    title = "באיזה נושא תרצו לתרגל?";

                if (!!this.activeCategory) {
                    label = this.activeCategory.label;
                    title = "נא לבחור מה"+ label;
                }

                return title
            }
        },
        methods: {
            ...mapActions('globalStore', [
                'callPopup'
            ]),
            ...mapActions('usersModule', [
                'dirtifyUser'
            ]),
            ...mapActions('testsModule', [
                'updateTestMenu'
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
@import '~imports/ui/styl/variables.styl'
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


.breadcrumbs
    text-align center
    margin 5vmin auto

    li
        display inline-block
        margin 0 0 0 15px
        a
            color darken(blue, 45)
            font-size 3vmin
            &:after
                content: '>'
                display inline-block
                margin-right 15px
        &:first-child a
            font-size 3.5vmin
        &:last-child a
            pointer-events none
            color darken(blue, 65)
            &:after
                display none

</style>