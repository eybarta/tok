if (Meteor.isServer) {
    Meteor.publish('allusers', function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Meteor.users.find({
                _id: { $ne: this.userId }
            });
        } 
        else {
            this.stop();
            return null
        }
    })
    
    Meteor.publish('usersByDate', function(date) {
        console.log("[SERVER|usersByDate] date: ", date);
        let cond = {}
        if (Roles.userIsInRole(this.userId, 'admin')) {
            cond['$gte'] = () => { return new Date(moment(date.start, 'D/M/YYYY'))};
                cond['$lt'] = () => { 
                    return !!date.end 
                    ? new Date(moment(date.end, 'D/M/YYYY'))
                    : new Date(moment(date.start, 'D/M/YYYY').add(1, 'day'))
                }
            console.log("condition >> ", cond.$gte(), cond.$lt());
            let find = Meteor.users.find({ 'profile.group': { $gte: cond.$gte(), $lt: cond.$lt() } }, { fields: {'profile.tests':0}});
            console.log("found> ", find.fetch());
            this.ready();
            return find; //Meteor.users.find({ 'profile.group': cond});
        } 
        else {
            this.stop();
            return null
        }
    })
    Meteor.publish('usercount', function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Meteor.users.find({
                _id: { $ne: this.userId }
            }).count();
        } 
        else {
            this.stop();
            return null
        }
    })
}