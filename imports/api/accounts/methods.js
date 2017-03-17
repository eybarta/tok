import { Random } from 'meteor/random'

Meteor.methods({
    'users.save'(data) {
        console.log("save_users ", data.userIds);
        _.each(data.userIds, function (id) {
            let userData = {
                username: id,
                password: Random.id(5),
                profile: {
                    group:data.date,
                    dirty: false                
                }

            }
            console.log(userData);
            Accounts.createUser(userData);
        })
    },
    'user.dirtify'(user) {
        console.log('dirtify method>> ', user._id);
        Meteor.users.update(user._id, {
            $set: {
                'profile.dirty': true
            }
        });
    }
});