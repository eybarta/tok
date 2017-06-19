export const Users = Accounts.users;

Users.allow({
    remove(userId, doc) {
        return Roles.userIsInRole(userId, 'admin')
    },
})