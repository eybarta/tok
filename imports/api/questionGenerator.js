import { Random } from 'meteor/random'
export function questionGenerator(category, type, amount, range) {
    if (category=='series') {
        return getQuestions(amount, type, range);
    }
}

function getQuestions(amount, type, range) {
    console.log('generate question.. type: ',type, ' amount: ', amount);
    let questionList = [],
        questionObj = {
            id: null,
            parts: [],
            answers: {
                correct: null,
                list:[]
            },
            control: null,
            // operation: 'add',
            chosenAnswer: null

        },
        _amount = parseInt(_amount),
        controlList = [],
        wrongControls = []

    /*
        Create Control number list >>
        for the operations
    */
    
    while (controlList.length<amount) {
        let control = _.random(...range)
        controlList.push(control);
        
        // Not Allow same values
        // *Make sure to have more range then amount to avoid infinite loop
        // controlList = _.uniq(_.compact(controlList));

        // Allow same values
        controlList = _.compact(controlList);
    }
    while(wrongControls.length<3) {
        wrongControls.push(_.random(-3,3));
        wrongControls = _.uniq(_.compact(wrongControls));
    }
    for (var i=0;i<amount;i++) {
        // Populate the question object
        let obj = _.cloneDeep(questionObj);
        obj.id = Random.id(7);
        obj.control = controlList[i];

        // PARTS        
        let primary = _.random(0,9);
        obj.parts.push(primary);
        for (var k = 0;k<5;k++) {
            obj.parts.push(_[type](_.last(obj.parts), obj.control))
        }

        // ANSWERS
        obj.answers.correct = _[type](_.last(obj.parts), obj.control);
        obj.answers.list.push(obj.answers.correct)
        for (var j=0;j<3;j++) {

            /*
                One way of wrong answers:
                (-3 -- 3 from obj.control)
            */
            // obj.answers.list.push(_[type](_.last(obj.parts), obj.control+wrongControls[j])); 

            /*
                Second way of wrong answers: 
                (-3 -- 3 from correct answer)
            */
            obj.answers.list.push(_.add(obj.answers.correct, wrongControls[j]))
        }
        questionList.push(obj);
    }
    return questionList;
}