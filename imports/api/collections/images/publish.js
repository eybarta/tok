import { Images } from './index'
if (Meteor.isServer) {
    Meteor.publish('images', function() {
        return Images.find({});
    });
}