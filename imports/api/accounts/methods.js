import dot from 'mongo-dot-notation';
import { Random } from 'meteor/random';
Meteor.methods({
    'users.isEmpty'() {
        const userCount = Meteor.users.find().count();
        console.log("[server] Check if any users exist >> ", userCount);
        return userCount === 0;
    },
    'users.save'(data) {
        console.log("save_users ", data.userIds);
        let _users = [];
        _.each(data.userIds, function (id) {
            let psw = Random.id(5)
            let userData = {
                username: id,
                password: psw,
                profile: {
                    group:data.date,
                    dirty: false,
                    psw,
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
    'users.updateprofiles'(userIds, data) {
        console.log('update profiles raw data >> ', data, " :: ", userIds);
        let profile = dot.flatten(data);
        console.log('users update multiple profiles... ', userIds, " :: ", profile);
        Meteor.users.update({ _id: { $in: userIds }}, profile, { multi:true});
    },
    'user.saveprofile'(userId, data) {
        console.log('raw data to save profile >> ', data);
        let profile = dot.flatten(data);
        console.log('user save profile... ', userId, " :: ", profile);
        Meteor.users.update(userId, profile);
    },
    'user.delete'(userId) {
        Meteor.users.remove(userId);
    },
    'user.dirtify'(user) {
        console.log('dirtify method>> ', user._id);
        Meteor.users.update(user._id, {
            $set: {
                'profile.dirty': true
            }
        });
    },
    'user.savetest'(testinfo) {
        let userId = Meteor.userId();
        console.log('savetest method >> ', testinfo);
        Meteor.users.update(userId, {
            $push: {
                'profile.tests': testinfo
            }
        });
    }
});