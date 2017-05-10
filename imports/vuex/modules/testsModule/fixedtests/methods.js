import dot from 'mongo-dot-notation';
var flatten = dot.flatten;
var op = dot.Operators;
var _ = lodash;
import { FixedTests } from './index'
/*
    Schema FixedTests:

    [
        {
            _id:1,
            type: 'series',
            tests: [
                {
                    name: 'test name 1',
                    questions: [{},{},{},]
                }
            ]
        }

    ]

*/
if (Meteor.isServer) {

Meteor.methods({
    'fixedtest.save'(data) {
        let testfound;
        let identifier = {type:data.type, "tests.name": data.name};
        let alltests = FixedTests.find({}).fetch();
        console.log('all test length > ', alltests);
        if (!!alltests.length) {
            testfound = _.find(alltests[0].tests, { name: data.name})

        }
        console.log('testfound > ', testfound);
        if (!!testfound) {
            testfound.questions = data.questions;
            FixedTests.upsert(identifier, { $set: { "tests": alltests[0].tests}});
        }
        else {
            FixedTests.upsert(
            { type: data.type}, 
            { $push: { 
                    "tests": { 
                         $each: [ 
                             {
                                name: data.name,
                                questions: data.questions
                             }
                          ]                        
                    }           
                }
            }
        )
        }
        
    },
})
}