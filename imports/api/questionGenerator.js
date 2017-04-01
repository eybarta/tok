import { Random } from 'meteor/random'
export function questionGenerator(category, type, amount) {
    if (category=='series') {
        return getQuestions(amount, type);
    }
}

/* 
    LOGIC >>

    I need generators for:
        1. question PARTS
        2. question ANSWERS

*/

var questionObject =  {
    id: null,
    parts: [],
    answers: {
        correct: null,
        list:[]
    },
    control: null,
    chosenAnswer: null
}

function getQuestions(amount, type) {
    console.log('generate question.. type: ',type, ' amount: ', amount);
    let hasChanger =  /changing/gi.test(type);
    let questionList = [],  // Final questions list,
        operation = type.split("_")[0],
        _amount = parseInt(_amount), // Amount of questions
        controlList = [], // Array of controls, 1 for each question
        changingControl = 0,  // Control iterator (-10,10)
        primaryRange = getPrimaryRange(type),    // First part ([RANGE] number to start with)
        secondaryRange = getSecondaryRange(type) // Second Constant (if exists)
    /*
        Create Control number list >>
        for the operations
    */
    controlList = generateControlList([], amount, type);

    for (var i=0;i<amount;i++) {
        // Populate the question object
        let obj = _.cloneDeep(questionObject);
        obj.id = Random.id(7);
        obj.control = controlList[i];
        if (hasChanger)
            changingControl = _.random(-10,10);
        
        // SERIES PARTS        
        let primary = _.random(...primaryRange);        
        obj.parts = createParts(6, primary, changingControl, obj.control, operation);
        
        // ANSWERS
        let correctAnswer = _.last(obj.parts)
        obj.answers = createAnswersList(3, correctAnswer);
        obj.parts.pop();

        
        questionList.push(obj);
    }
    return questionList;
}

function createParts(amount, primary, changer, control, operation) {
    let _control = null,
        parts = [];
    for (var k = 0;k<amount;k++) {
        let iter = k * changingControl;
        _control = _[operation](control, iter);
        parts.push(_[operation](_.last(parts), _control))
    }
    return parts;
}

function createAnswersList(amount, correct, controls) {
    let list = [];
    list.push(correct)
    for (var j=0;j<3;j++) {
        // -3 -- 3 from correct answer
        list.push(_.add(correct, wrongControls[j]))
    }   
    return {
        correct,
        list
    }
}


function generateWrongControls(controls) {
    let wrongControls = generateWrongControls([]);
    while(controls.length<3) {
        controls.push(_.random(-3,3));
        controls = _.uniq(_.compact(controls));
    }
    return controls;
}

function generateControlList(controls, amount, type) {
    let range = getControlRange(type);
    while (controls.length<amount) {
        let control = _.random(...range)
        controls.push(control);
        
        // Not Allow same values
        // *Make sure to have more range then amount to avoid infinite loop

        // Allow same values
        controls = _.compact(controls);
    }
    return controls
}
function getPrimaryRange(type) {
    switch (type) {
        case 'add':
            return [0,100]
            break;
        case 'subtract':
            return [-100,100]
            break;
        default:
            return [0,100]
            break;
    }
}
function getSecondaryRange(type) {
    // switch (type) {
    //     case 'add':
    //         return [1,100]
    //         break;
    //     case 'subtract':
    //         return [1,100]
    //         break;
    //     default:
    //         return [0,100]
    //         break;
    // }
    return null;
}

function getControlRange(type) {
    switch (type) {
        case 'add':
            return [1, 20]
            break;
        case 'subtract':
            return [1,20]
            break;
        case 'add_changingSpread':
            return [-20,20];
            break;
        default:
            return [0,100]
            break;
    }
}