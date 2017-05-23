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
        let categoryfound;
        let identifier = {category:data.category};
        let allquestions = Questions.find({}).fetch();

        let question = {
            type: data.type,
            questions: data.questions,
            answers: data.answers,
            imageUrl: data.imageUrl
        }
        console.log('all questions  > ', allquestions);
        if (!!allquestions.length) {
            console.log('category exists');
            // categoryfound = _.find(allquestions[0].tests, { name: data.name})
            Questions.upsert(identifier, { $push: { "questions": question}});
        }
        else {
            console.log('category does not exists');
            Questions.upsert(identifier, { $push: { "questions": question}});
        }
    },
})
}