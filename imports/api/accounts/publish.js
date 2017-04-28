if (Meteor.isServer) {
    Meteor.publish('allusers', function() {
        var self = this;
        let userId = this.userId
         if (Roles.userIsInRole(userId, 'admin')) {
            return Meteor.users.find({
                _id: { $ne: this.userId }
            });
        } 
        else {
            return null
        }
        self.ready();
    });
}