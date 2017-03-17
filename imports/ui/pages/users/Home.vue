<template>
<div class="users-home">
    <main>
        <ul class="local-breadcrumbs">
            <li v-for="crumb in breadcrumbs"><a v-text="crumb.label" @click.prevent="itemClickHandler(item.value, $index)" href="#p"></a></li>
        </ul>
        <h2>באיזה נושא תרצו לתרגל?</h2>
        <div class="block block-60">
                <transition-group name="list-complete" class="waffle" tag="div"  appear>
                    <a :key="item" v-for="item in menuitems" class="item" href="#p" @click.prevent="itemClickHandler(item.value)"><span v-text="item.label">  </span></a>
                </transition-group>
        </div>
    </main>
</div>
</template>
<script>
import { categories } from '/imports/api/categories'
import { mapState, mapActions } from 'vuex';
import Popup from '../../components/Popup.vue'
    export default {
        data() {
            return {
                categories,
                menuTypes: ['category', 'subcategory', 'type'],
                currentMenuType: 'category'
            }
        },
        computed: {
            ...mapState([
                'user',
                'users',
                'testMenu'
            ]),
            breadcrumbs() {
                let crumbs = [];
                let menu = this.testMenu;
                console.log('bd ', this.testMenu);
                if (!!menu.category) {
                    let category = _.find(this.categories, {value:menu.category});
                    crumbs.push(category)
                }
                if (!!menu.subcategory) {
                    let subcat = _.find(category.children, { value: menu.subcategory})
                    crumbs.push(subcat)
                }

                return crumbs;
            },
            category() {
                let cat = this.testMenu.category;
                if (!!this.testMenu.category) {
                    return _.find(this.categories, {value:cat});
                }
                return { children:[]};
            },
            menuitems() {
                let testMenu = this.testMenu;
                if (!!testMenu.subcategory) {
                    return testMenu.type;
                }
                else if (!!testMenu.category) {
                    let cat = _.find(this.categories, {value:testMenu.category});
                    console.log('cat > ', cat);
                    return cat.children
                }
                return this.categories
                //testMenu.subcategory || testMenu.type || testMenu.category || []
            }
        },
        mounted() {
            let user = this.user;
            if (!user.profile.dirty) {
                this.callPopup({ title:'פרטים אישיים', type:'UserProfile'})
                this.dirtifyUser();
            }
            console.log("categories >> ", this.categories);
        },
        methods: {
            ...mapActions([
                'callPopup',
                'dirtifyUser',
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
    span
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

    
</style>