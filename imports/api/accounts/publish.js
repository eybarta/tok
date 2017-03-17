
// Give authorized users access to sensitive data by group
// Meteor.publish('users', function (group) {
//   if (Roles.userIsInRole(this.userId, ['view-secrets','admin'], group)) {

//     return Meteor.secrets.find({group: group});

//   } else {

//     // user not authorized. do not publish secrets
//     this.stop();
//     return;

//   }
// });


if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('users', function() {
        var self = this;
         if (Roles.userIsInRole(this.userId, 'admin')) {
            return Meteor.users.find({});
        } 
        // self.added('users');
        self.ready();
       
        // else {
        //     // user not authorized. do not publish secrets
        //     return;
        // }
    });
}