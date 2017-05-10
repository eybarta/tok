import { Questions } from './index'
if (Meteor.isServer) {
    Meteor.publish('questions', function(category) {
        let questions;
        if (!!category) {
            questions = Questions.find({ "category.value": category});
        }
        else {
            questions = Questions.find({});
        }
        this.ready();
        console.log("PUBLISHED QUESTIONS > ", questions.fetch());
        return questions;
    });
}