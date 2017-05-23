import { Images } from './index'
if (Meteor.isServer) {
    Meteor.publish('images', function() {
        this.ready();
        return Images.find({});
    });
}