import dot from 'mongo-dot-notation';
var flatten = dot.flatten;
var op = dot.Operators;
var _ = lodash;
import { Questions } from './index'
/*
    Schema Questions:

    [
        {
            _id:1,
            category: 'hebrew',
            questions: [
                {
                    type: 'vocab',
                    question: 'שאלה...',
                    answers: [תשובות...]
                }
            ]
        }

    ]

*/
if (Meteor.isServer) {

Meteor.methods({
    'questions.save'(data) {
        console.log('save question in server >> ', data);
        // let categoryfound;
        let identifier = {category:data.category};
        // let allquestions = Questions.find({}).fetch();
        let questions = data.questions;
        for (var i = 0 ; i < questions.length ; i++) {
            if (!!data.imageUrl) {
                questions[i].imageUrl = data.imageUrl
            }
            questions[i].type = data.type
        }

        // let question = {
        //     type: data.type,
        //     questions,
        //     answers: data.answers
        // }
        // console.log('all questions  > ', allquestions);
        Questions.upsert(identifier, { $push: { "questions": {$each:questions}}});
        
        // if (!!allquestions.length) {
        //     console.log('category exists, questions to push >> ', questions);
        //     Questions.upsert(
        //         {
        //             "category.value":data.category,
        //             "questions.type.value":data.type}, 
        //         {
        //             $push:
        //             {
        //                 "questions.$.questions": { $each:questions}
        //             }
        //         }
        //     )
        //     // categoryfound = _.find(allquestions[0].tests, { name: data.name})
        //     // Questions.upsert(identifier, { $push: { "questions": question}});
        // }
        // else {
        //     console.log('category does not exists');
        //     Questions.upsert(identifier, { $push: { "questions": questions}});
        // }
    },
})
}