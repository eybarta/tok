<template>
<main class="manage-users">
    <h2>ניהול משתמשים</h2>

    <div v-if="!!users.length" class="user-list">

    </div>
    <p class="tcenter mtbase" v-else>אין משתמשים רשומים במערכת.. כדאי להוסיף!</p>
    <div class="tcenter mtbase">
        <button @click="callPopup({ title:'הוסף משתמשים', type:'AddUsers'})" class="btn btn-success">הוסף משתמשים</button>
    </div>
</main>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    methods: {
        ...mapActions([
            'callPopup'
        ])
    },
    computed: {
        ...mapState([
            'users'
        ])
    }
}
</script>
<style lang="stylus">
.mtbase
    margin-top 30px
</style>