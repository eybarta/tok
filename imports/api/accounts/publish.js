
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
    Meteor.publish('allusers', function() {
        var self = this;
        console.log("PUBLISH USERS>> ID== ", this.userId);
        let userId = this.userId
         if (Roles.userIsInRole(userId, 'admin')) {
            //  console.log(Meteor.users.find({ '_id': { $ne: "hCLiQhsujWEWpB3RN" }}));
            return Meteor.users.find({
                _id: { $ne: this.userId }
            });
        } 
        else {
            return null
        }
        // self.added('users');
        self.ready();
       
        // else {
        //     // user not authorized. do not publish secrets
        //     return;
        // }
    });
}