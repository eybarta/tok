<template>
<div class="manage-users">
<!--
    <h3>ניהול משתמשים</h3>
-->
    <div v-if="!!users.length" class="user-list pt-med">
        <div class="filters pb-big col-6">
            <multiselect
                    v-model="filters.group" 
                    placeholder="פילטור לפי קבוצה"
                    :multiple="true" 
                    :options="groups"
                    :searchable="true"
                    :clearOnSelect="true"
                    :ShowLabels="false"
                    :allow-empty="true"></multiselect>
        </div>
        <table class="user-table">
            <thead>
                <th>שם משתמש  (ת.ז)</th>
                <th>שם מלא</th>
                <th>קבוצה</th>
                <th @click="sort('profile.dob')"> <i :class="['fa', sortClass('profile.dob')]"></i> גיל</th>
                <th>סטטוס</th>
                <th>יישוב</th>
                <th>טלפון</th>
                <th>מייל</th>
            </thead>
            <tbody>
                <tr v-for="user in parsedUsers" :class="[!!user.selected ? 'selected' : '']" @click="user.selected=!user.selected">
                    <td v-html="user.username"></td>
                    <td v-html="user.profile.name"></td>
                    <td v-html="user.profile.group"></td>
                    <td v-html="user.profile.age"></td>
                    <td v-html="user.profile.status.label" :class="[user.profile.status.value=='active' ? 'green' : 'red']"></td>
                    <td v-html="user.profile.city"></td>
                    <td v-html="user.profile.phone"></td>
                    <td v-html="user.profile.email"></td>
                </tr>
            </tbody>
        </table>
    </div>
    <p class="tcenter mt-big" v-else>אין משתמשים רשומים במערכת.. כדאי להוסיף!</p>
    <div :class="[!!users.length ? 'tright' : 'tcenter', 'mt-small']">
        <button @click="callPopup({ title:'הוסף משתמשים', type:'AddUsers'})" class="btn btn-success">הוסף משתמשים</button>
        <button @click="callPopup({ title:'פרטים אישיים', type:'UserProfile', data:selected[0]})" v-if="selected.length==1" class="btn btn-warning">עריכת משתמש</button>

        <div class="changers" v-if="selected.length>1">
            <label class="orange" for="">שינוי גורף:</label>
             <multiselect
                    placeholder="שינוי סטטוס"
                    track-by="value" label="label"
                    :options="userOptions.status"
                    :ShowLabels="false"
                    :searchable="false"
                    :close-on-select="true"
                    :allow-empty="false"></multiselect>
        </div>
    </div>
</div>
</template>
<script>
import Multiselect from '/imports/ui/components/vue-multiselect/src/Multiselect.vue'
import { userOptions } from '/imports/api/userConstants'
import { mapState, mapActions } from 'vuex'
export default {
    data() {
        return {
            userOptions,
            sortby: {
                keys: [],
                dir: []
            },
            filters: {
                group: [],

            }
        }
    },
    components: {
        Multiselect
    },
    methods: {
        ...mapActions('globalStore', [
            'callPopup'
        ]),
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
    },
    computed: {
        ...mapState('usersModule', [
            'users'
        ]),
        groups() {
            return _.uniq(_.map(this.users, 'profile.group'))
        },
        selected() {
            let users = this.users
            return _.filter(users, 'selected');
        },
        parsedUsers() {
            let users = _.clone(this.users);
            _.each(users, user => {
                if (!!user.profile.dob) {
                    user.profile.age = this.userAge(user.profile.dob);
                }
            })
			let keys = this.sortby.keys; 
			let dir = this.sortby.dir;
            if (!!this.filters.group.length) {
                users = _.filter(users, user => {
                    return this.filters.group.indexOf(user.profile.group)>-1
                })
            }
			if (keys.length>0) {
				return _.orderBy(users, keys, dir)
			}
            return users;
        }
        
    }
}
</script>
<style lang="stylus">
@import '~imports/ui/styl/variables'
@import '~imports/ui/styl/mixins'
.manage-users
    margin-top 20px
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
    .multiselect
        max-width 300px
.changers
    mid()
    padding 0 10px
    width 50%
    label
        mid()
        padding-left 10px
    .multiselect
        mid()
        width 30%
    
</style>