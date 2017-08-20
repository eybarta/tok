export const Users = Accounts.users;

if (Meteor.isServer) {
    Users.rawCollection().createIndex({
        "profile.tests": 1,
        "username": 2
    });

}
Users.allow({
    remove(userId, doc) {
        return Roles.userIsInRole(userId, 'admin')
    },
})