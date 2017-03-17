<template>
<div class="admin-home">
    <h2>מה נשמע בוס?</h2>
    <ul>
        <li>
       		<router-link :to="{ name:'manageUsers', exact: true }" class="btn btn-success">ניהול משתמשים</router-link>
        </li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</div>
</template>
<script>
import { mapActions } from 'vuex'
    export default {
        
    }
</script>
<style lang="stylus">
h2
    text-align center
</style>