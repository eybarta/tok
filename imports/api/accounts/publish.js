if (Meteor.isServer) {
    process.env.HTTP_FORWARDED_COUNT = 1
    Meteor.users._ensureIndex({
        "username": "text",
        "profile.name": "text"
    });
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
    Meteor.publish("userStatus", function() {
        let onlineusers = Meteor.users.find({'status.online':true, _id: {$ne: '9MrcW38w7CywChRco'}}, {fields: {'profile.tests':0}});
        return onlineusers;
    });
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
            // this.ready();
            return find; //Meteor.users.find({ 'profile.group': cond});
        } 
        else {
            this.stop();
            return null
        }
    })
    Meteor.publish('usersByText', function(text) {
        console.log("[SERVER|usersByText] text: ", text);
        let cond = {}
        if (Roles.userIsInRole(this.userId, 'admin')) {
           
            let find = Meteor.users.find({ $text: { $search: text }});
            console.log("found> ", find.fetch());
            return find; 
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