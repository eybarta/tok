<template>
<div class="manage-users">
        <div class="user-list pt-med">
            <div class="filters mb-med clearfix">
                <div class="date-range right">
                    <h5 class="label">פילטור לפי תאריך</h5>
                    <date-range v-model="filters.date"></date-range>
                </div>
                <div class="free-search">
                    <h5 class="label inline">חיפוש:</h5>
                    <input-field @change.native="freeTxtSearch" class="search" v-model="filters.search"></input-field>
                </div>
            </div>
            <div class="data-table-wrapper"  v-if="!!users.length && parsedUsers.length>0">
                <table class="data-table user-table">
                    <thead>
                        <th class="sortable" @click="sort('username')"> <i :class="['fa', sortClass('username')]"></i> שם משתמש</th>
                        <th>סיסמא</th>
                        <th>שם מלא</th>
                        <th class="sortable" @click="sort('profile.group')"> <i :class="['fa', sortClass('profile.group')]"></i> קבוצה</th>
                        <th class="sortable" @click="sort('profile.dob')"> <i :class="['fa', sortClass('profile.dob')]"></i> גיל</th>
                        <th class="sortable" @click="sort('profile.status.label')"><i :class="['fa', sortClass('profile.status.label')]"></i> סטטוס</th>
                        <th>יישוב</th>
                        <th>טלפון</th>
                        <th>מייל</th>
                    </thead>
                    <paginate
                name="parsedUsers"
                :list="parsedUsers"
                :per="usersPerPage"
                tag="tbody"
                class="table-row"
                >
                        <tr v-for="user in paginated('parsedUsers')" :key="user.username" :class="[!!user.selected ? 'selected' : '', 'table-row-item']" @click="user.selected=!user.selected">
                            <td v-html="user.username"></td>
                            <td v-html="user.profile.psw"></td>
                            <td v-html="user.profile.name"></td>
                            <td v-html="parseDate(user.profile.group)"></td>
                            <td v-html="user.profile.age"></td>
                            <td v-html="user.profile.status.label" :class="[user.profile.status.value=='active' ? 'green' : 'red']"></td>
                            <td v-html="user.profile.city"></td>
                            <td v-html="user.profile.phone"></td>
                            <td v-html="user.profile.email"></td>
                        </tr>
                    </paginate>
                </table>
                <div class="table-pager" v-if="parsedUsers.length > usersPerPage">
                    <preloader :size="tiny" v-if="loadingMoreUsers"></preloader>
                    <paginate-links :async="true" id="pager" ref="pager" for="parsedUsers" :limit="4" 
                    :show-step-links="true"
                    :hide-single-page="true"
                    :step-links="{next: 'הבא', prev: 'קודם'}"></paginate-links>
                </div>
            </div>
            <h4 class="else-msg" v-if="!!users.length && !loadingusers && parsedUsers.length<0">לא נמצאו משתמשים... נסה להרחיב את הפילטור</h4>
        </div>
        <preloader :backdrop="false" pretitle="טוען משתמשים" v-if="!!loadingusers"></preloader>
        <!--
        <p class="tcenter mt-big" v-else>אין משתמשים רשומים במערכת.. כדאי להוסיף!</p>
        -->
        <div :class="[!!users.length ? 'tright' : 'tright', 'mt-small', 'actions']">
            <button @click="callPopup({ title:'הוסף משתמשים', type:'AddUsers'})" class="right btn btn-success">הוסף משתמשים</button>
            <button @click="callPopup({ title:'פרטים אישיים', type:'UserProfile', data:selected[0]})" v-if="selected.length==1" class="right mr-small btn btn-warning">עריכת משתמש</button>
            <div class="changers" v-if="selected.length>1">
                <label class="orange" for="">שינוי גורף:</label>
                <multiselect
                        class="dropdown"
                        v-model="multichange.selected"
                        placeholder="תבחר"
                        track-by="value"
                        label="label"
                        :options="multichange.options"
                        :show-labels="false"
                        :searchable="false"
                        :close-on-select="true"
                        :allow-empty="false"></multiselect>
                <multiselect
                        class="dropdown"
                        v-if="multichange.selected.value==='status'"
                        placeholder="שינוי סטטוס"
                        track-by="value" 
                        label="label"
                        v-model="multichange.status"
                        :options="userOptions.status"
                        :show-labels="false"
                        :searchable="false"
                        :close-on-select="true"
                        :allow-empty="false"></multiselect>
                    <input 
                        class="field"
                        ref="groupcal"
                        v-if="multichange.selected.value==='group'"
                        v-model="multichange.groupdate"
                        type="text" >
                    <button class="btn btn-success-inverse mr-small" @click="saveToSelected">שמור</button>
            </div>
        </div>
</div>
</template>
<script>
console.log('Meteor.isClient > ', Meteor.isClient);
if (Meteor.isClient) {
    var Pikaday = require('pikaday');
}
import Preloader from '/client/ui/components/Preloader.vue'
import { userOptions } from '/imports/api/userConstants'
import { mapState, mapActions } from 'vuex'
import InputField from '/client/ui/components/form/InputField.vue'
import DateRange from '/client/ui/components/form/DateRange.vue'
export default {
    data() {
        return {
            userOptions,
            usersPerPage:25,
            paginate: ['parsedUsers'],
            sortby: {
                keys: [],
                dir: []
            },
            filters: {
                group: [],
                search: '',
                date: {
                    start: null,
                    end: null
                }
            },
            startPicker: null,
            endPicker: null,
            multichange:  {
                selected: '',
                options: [
                    {
                        label: 'סטטוס',
                        value: 'status' 
                    },
                    {
                        label: 'קבוצה',
                        value: 'group' 
                    }
                ],
                groupdate: null,
                status:null
            }
            
        }
    },
    watch: {
        'multichange.selected'() {
            let vm = this;
            if (this.multichange.selected.value==='group') {
                this.$nextTick(function() {
                    console.log('init the datepicker for group cal');
                    new Pikaday({
                        field: vm.$refs.groupcal,
                        format: "D/M/YYYY",
                        onSelect: function() {
                            vm.$set(vm.multichange, 'groupdate', this.toString("D/M/YYYY"))
                        }
                    })
                })
            }
        }
    },
    components: {
        InputField,
        DateRange,
        Preloader
    },
    methods: {
        ...mapActions('globalStore', [
            'callPopup'
        ]),
         ...mapActions('usersModule', [
            'updateMultipleUserProfiles',
            'initUsers'
        ]),
        freeTxtSearch() {
            console.log('free text search');
            this.initUsers({ type:'free', text:this.filters.search})
        },
        updateStartDate(date) {
            console.log('this.startPicker >> ', this.startPicker);
            this.startPicker.setStartRange(date);
            this.endPicker.setStartRange(date);
            this.endPicker.setMinDate(date);
        },
        updateEndDate(date) {
            this.startPicker.setEndRange(date);
            this.startPicker.setMaxDate(date);
            this.endPicker.setEndRange(date);
        },
        saveToSelected() {
            let tochange = this.multichange;
            let profile;
            let ids = _.map(this.selected, '_id');
            if (tochange.selected.value==='status') {
                let status = tochange.status;
                profile = { profile: { status }}
            }
            else if (tochange.selected.value==='group') {
                let group = tochange.groupdate; 
                profile = { profile: { group }}
            }
            this.updateMultipleUserProfiles([ids, profile]);
        },
        async promiseRefs(ms) {
            let vm = this;
            return new Promise(resolve => {
                let int = Meteor.setInterval(function() {
                    console.log('promise refs >> ', vm.$refs.start);
                    if (!!vm.$refs.start) {
                        Meteor.clearInterval(int);
                        resolve(vm.$refs);
                    }
                }, 100)
            })
        },
        async initFilterDatePickers() {
            let vm = this;
            let daterange = this.filters.date;
            let refs = await this.promiseRefs();
            if (!!refs) {
                this.startPicker = new Pikaday({
                    field: vm.$refs.start,
                    format: "D/M/YYYY",
                    onSelect: function() {
                        let date = this.getDate();
                        vm.$set(vm.filters.date, 'start', this.toString("D/M/YYYY"))
                        vm.updateStartDate(date);
                    }
                    
                })
                this.endPicker = new Pikaday({
                    field: vm.$refs.end,
                    format: "D/M/YYYY",
                    onSelect: function() {
                        let date = this.getDate();
                        vm.$set(vm.filters.date, 'end', this.toString("D/M/YYYY"))
                        vm.updateEndDate(date);
                    }
                })
                console.log("this.endPicker > ", this.endPicker);
            }
        },
        toggleSelect(user, e) {
            console.log('toggle user')
            let __id = {_id: user._id};
            let exist = _.find(this.selected, __id)
            console.log("exists > ", exist);
            if (!!exist) {
            console.log("exists?? > ", !!exist);
               this.selected =  _.filter(this.selected, function(obj) {
                    return obj._id != user._id;
                })
            } else {
            console.log("does not exists > ", !!exist);
                this.selected.push(user)
            }
            // toggleSelect(user, $event)
        },
        // userStatusLabel(status) {
        //     if (!!status) {
        //         let options = this.userOptions.status;
        //         console.log("options > ", options);
        //         console.log("status > ", status);
        //         let statusfind = _.find(options, { value: status});
        //         console.log('statusfind > ', statusfind);
        //         return _.find(options, { value: status}).label;
        //     }
        // },
        userAge(dob) {
            if (!!dob) {
                // console.log(dob, " :: ", moment().diff(moment(dob, 'D/M/YYYY'), 'years'));
                return moment().diff(moment(dob, 'D/M/YYYY'), 'years')
            }
            else {
                return ''
            }
        },
        sortClass(key) {
			let sortindex = this.sortIndex(key);
			return (sortindex>-1) 
				? 'fa-sort-' + this.sortby.dir[sortindex]
				: 'fa-sort';
		},
        sortIndex(key) {
			return this.sortby.keys.indexOf(key);
		},
		sort(key, reset) {
			console.log('reset? ', reset)
			if (reset) {
				this.sortby.keys = [];
				this.sortby.dir = [];
			}
			let sortindex = this.sortIndex(key);
			if (sortindex<0) {
				this.sortby.keys.push(key);
				this.sortby.dir.push('desc')
			}
			else {
				this.$set(this.sortby.dir, sortindex, this.sortby.dir[sortindex]=='desc' ? 'asc' : 'desc')
			}
		},
        parseDate(date) {
            return moment(date).utc().format('D/M/YYYY')
        }
    },
    computed: {
        ...mapState('usersModule', [
            'users',
            'loadingusers',
            'loadingMoreUsers'
        ]),
        groups() {
            return _.uniq(_.map(this.users, 'profile.group'))
        },
        selected() {
            let users = this.users
            return _.filter(users, 'selected');
        },
        parsedUsers() {
            let dateformat = "D/M/YYYY"
            let users = _.clone(this.users);
            let search = this.filters.search;
            console.log("USERS >> ", users);
            _.each(users, user => {
                if (!!user.profile && !user.profile.dob) {
                    user.profile.age = this.userAge(user.profile.dob);
                }
            })
			let keys = this.sortby.keys; 
			let dir = this.sortby.dir;
            // if (!!this.filters.group.length) {
            //     users = _.filter(users, user => {
            //         return this.filters.group.indexOf(user.profile.group)>-1
            //     })
            // }
            if (!!this.filters.date.start) {
                let start = this.filters.date.start;
                users = _.filter(users, user => {
                    let condition = !this.filters.date.end ? 'isSame' : 'isSameOrBefore';
                    console.log("[START FILTER] condiition> ", condition)
                    console.log("[START FILTER] date format > ", dateformat)
                    console.log("[START FILTER] start date > ", start, " in moment: ", moment(start, dateformat))
                    groupDateUTC = moment(moment(user.profile.group).utc().format('D/M/YYYY'), 'D/M/YYYY');
                    console.log("[START FILTER] group ", user.profile.group, " in UTC: ", groupDateUTC);
                    return moment(start, dateformat)[condition](groupDateUTC);
                })
                console.log('start users > ', users.length);
                
            }
            if (!!this.filters.date.end) {
                let end = this.filters.date.end;
                users = _.filter(users, user => {
                    let condition = !this.filters.date.start ? 'isSame' : 'isSameOrBefore';
                    return moment(user.profile.group)[condition](moment(end, dateformat));
                })
                console.log('end users > ', users.length);
            }
            if (!!search) {
                users = _.filter(users, user => {
                    let profilestring = _.values(_.pickBy(user.profile, _.isString));
                    let userstring = user.username + ',' + profilestring;
                    return userstring.indexOf(search)>-1
                })
            }
			if (keys.length>0) {
                console.log("sort..", users, " :: ", keys, " :: ", dir);
				return _.orderBy(users, keys, dir)
			}
            console.log('final parsed users: ', users);
            return users;
        }
        
    }
}
</script>
<style lang="stylus">
@import '~imports/styl/variables'
@import '~imports/styl/mixins'
.manage-users
    margin-top 20px
    padding 0 5%
    padding-bottom 120px
.user-table
    width 100%
    border-top 1px solid bluegreen
    tr
        cursor pointer
    th
        text-align right
        padding 12px 15px 12px 25px
        font-weight bold
        border-bottom 1px solid lighten(bluegreen, 12)
        vertical-align middle
        white-space nowrap
        position relative
        &.sortable
            cursor pointer
        .fa
            position absolute
            top 50%
            left 15%
            transform translate(0, -50%)
    td
        // border-bottom 1px solid bluegreen
        border-left 1px solid rgba(bluegreen, 0.1)
        padding 10px 15px
        font-size 12px
        white-space nowrap
        vertical-align middle
        &:last-child
            border none
    tr:nth-child(odd)
        td
            background rgba(darken(bluegreen, 18), 0.04)
    tr.selected
        td
            background rgba(orange, 0.15)
.filters
    width 100%
    position relative
    .free-search
        position absolute
        left 0
        bottom 0
    .multiselect
        max-width 300px
.changers
    overflow visible
    padding 0
    label
        mid()
        padding-left 10px
    .multiselect
        mid()
        width auto
        &:last-child
            min-width 145px
.date-range
    h5
        padding-bottom 10px
.fetch-btn
    display inline-block
    vertical-align bottom
    margin-right 10px
.actions
    .btn
        margin-left 20px
// input
//     height 36px
//     border-radius 4px
//     border 1px solid lighten(gray, 70)
//     padding 0 10px
//     display inline-block

.table-row-move
    transition all .5s
.table-row-item
    backface-visibility hidden

.table-pager
    position relative
    background lighten(darkblue, 55)
    padding 10px
    border-radius 0 0 4px 4px
    .preloader
        left 5%
        top 50%
        transform translateY(-50%)
    ul
        text-align right
        li
            display inline-block
            padding 0 10px
            cursor pointer
            a
                color lighten(gray, 10)
                font-size 14px
            &.number a
                font-size 16px
            &.disabled a
                color lighten(gray, 40)
                cursor default
            &.active a
                color darken(bluegreen, 10)
                text-decoration underline
.else-msg
    text-align center
    margin-top 80px

</style>