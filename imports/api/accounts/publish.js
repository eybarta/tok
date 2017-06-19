if (Meteor.isServer) {
    Meteor.publish('allusers', function() {
        var self = this;
        let userId = this.userId
         if (Roles.userIsInRole(userId, 'admin')) {
            self.ready();
            return Meteor.users.find({
                _id: { $ne: this.userId }
            });
        } 
        else {
            self.ready();
            return null
        }
    });
}