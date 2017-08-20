import dot from 'mongo-dot-notation';
import { Random } from 'meteor/random';
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
        let identifier = {category:data.category};
        let questions = data.questions;
        for (var i = 0 ; i < questions.length ; i++) {
            if (!!data.imageUrl) {
                questions[i].imageUrl = data.imageUrl
            }
            questions[i].id = Random.id(12);
            questions[i].type = data.type
        }
        Questions.upsert(identifier, { $push: { "questions": {$each:questions}}});
    },
    'questions.remove'(data) {
        console.log('[SERVER METHOD:question.remove]', data );
        let identifier = !!data.id ? { id: data.id } : { question: data.question }
        Questions.update(
            { category: data.category}, 
            { 
                $pull: { 
                    "questions": { question: data.question }
                }
        }, (err,res) => {
            console.log('question remove update callback >> ', err, " :: ", res);
            if (!err) {
                return res;
            }
        })
        return true;
    }
})
}