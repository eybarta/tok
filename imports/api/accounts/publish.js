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
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return fetchUsersByDate(date);
            
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
    Meteor.publish('usersStatistics', function(filter) {
            console.log("[SERVER:usersStatistics] filter > ", filter, this.userId, " :: ", Roles.userIsInRole(this.userId, 'admin'));
           if (Roles.userIsInRole(this.userId, 'admin')) {
                if (!!filter.all) {
                    let find =  Meteor.users.find(
                        {
                            _id: { $ne: this.userId },
                            'profile.tests': {$exists: true}
                        },
                        {
                            fields: { 'profile.tests': 1, 'username': 1 }
                        }
                    )
                    console.log("FOUND: ", find.fetch());
                    return find;
                }
                else if (!!filter.date) {
                    return fetchUsersByDate(filter.date, true);
                }
                else if (!!filter.users) {
                    console.log('WTF');
                    let usernames = _.map(filter.users, obj => obj.value);
                    console.log("USERNAMES>> ", usernames);
                    let find =  Meteor.users.find(
                        {
                            username: { $in: usernames },
                            'profile.tests': {$exists: true}
                        },
                        {
                            fields: { 'profile.tests': 1, 'username':1 }
                        }
                    )
                    console.log("FOUND: ", find.fetch());
                    return find;
                }
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


function fetchUsersByDate(date, statistics) {
    let cond = {}
    cond['$gte'] = () => { return new Date(moment(date.start, 'D/M/YYYY'))};
        cond['$lt'] = () => { 
            return !!date.end 
            ? new Date(moment(date.end, 'D/M/YYYY'))
            : new Date(moment(date.start, 'D/M/YYYY').add(1, 'day'))
        }
        let find;
        if (statistics) {
            find = Meteor.users.find({'profile.tests': {$exists: true}, 'profile.group': { $gte: cond.$gte(), $lt: cond.$lt() } }, { fields: {'profile.tests':1, 'username': 1}});
        }
        else {
            find = Meteor.users.find({ 'profile.group': { $gte: cond.$gte(), $lt: cond.$lt() } }, { fields: {'profile.tests':0}});
        }
    return find; 
}