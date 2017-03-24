import dot from 'mongo-dot-notation';
import { Random } from 'meteor/random'
Meteor.methods({
    'users.save'(data) {
        console.log("save_users ", data.userIds);
        let _users = [];
        _.each(data.userIds, function (id) {
            let userData = {
                username: id,
                password: Random.id(5),
                profile: {
                    group:data.date,
                    dirty: false,
                    status: {
                        label: "פעיל",
                        value:"active"
                    }

                }

            }
            console.log(userData);
            _users.push(userData)
            Accounts.createUser(userData);
        })
        return {'users':_users}
    },
    'user.saveprofile'(userId, data) {
        let profile = dot.flatten(data);
        console.log('user save profile... ', userId, " :: ", profile);
        Meteor.users.update(userId, profile);
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