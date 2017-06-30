import { Questions } from './index'
if (Meteor.isServer) {
    Meteor.publish('questions', function(category) {
        return !!category
        ? Questions.find({ "category.value": category})
        : Questions.find({});
        // if (!!category) {
        //     questions = Questions.find({ "category.value": category});
        // }
        // else {
        //     questions = Questions.find({});
        // }
        // console.log("PUBLISHED QUESTIONS > ", questions.fetch());
    });
}