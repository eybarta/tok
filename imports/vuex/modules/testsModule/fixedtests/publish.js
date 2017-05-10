import { FixedTests } from './index'
if (Meteor.isServer) {
    Meteor.publish('fixedtests', function() {
        return FixedTests.find({});
        this.ready();
    });
}