import { Random } from 'meteor/random'
export function questionGenerator(category, type, amount) {
    if (category=='series') {
        return getQuestions(amount, type);
        // if (['add', 'subtract', 'multiply','divide', 'add_changingSpread'].indexOf(type)>-1) {
        //     return getQuestions(amount, type);
        // }
        // else {
        //     if (type=='add_changingSpread') {
        //         return getChangingSpreadQuestions(amount, type);
        //     }
        // }
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

// function getQuestions(amount, type) {
//     console.log('generate question.. type: ',type, ' amount: ', amount);

//     let questionList = [],  // Final questions list,
//         operation = type.split("_")[0],
//         _amount = parseInt(_amount), // Amount of questions
//         controlList = [], // Array of controls, 1 for each question
//         changingControl = null,  // Control iterator (-10,10)
//         wrongControls = [], // Array of 'wrong controls' for wrong answers
//         primaryRange = getPrimaryRange(type),    // First part ([RANGE] number to start with)
//         secondaryRange = getSecondaryRange(type) // Second Constant (if exists)
//     /*
//         Create Control number list >>
//         for the operations
//     */
//     controlList = generateControlList([], amount, type);
//     wrongControls = generateWrongControls([]);
//     for (var i=0;i<amount;i++) {
//         // Populate the question object
//         let obj = _.cloneDeep(questionObject);
//         obj.id = Random.id(7);
//         obj.control = controlList[i];

//         // PARTS        
//         let primary = _.random(...primaryRange);
//         obj.parts.push(primary);
//         for (var k = 0;k<5;k++) {
//             obj.parts.push(_[type](_.last(obj.parts), obj.control))
//         }
//         // ANSWERS
//         obj.answers.correct = _[type](_.last(obj.parts), obj.control);
//         obj.answers.list.push(obj.answers.correct)
//         for (var j=0;j<3;j++) {
//             // -3 -- 3 from correct answer
//             obj.answers.list.push(_.add(obj.answers.correct, wrongControls[j]))
//         }
//         questionList.push(obj);
//     }
//     return questionList;
// }


function getQuestions(amount, type) {
    console.log('generate question.. type: ',type, ' amount: ', amount);
    let hasChanger =  /changing/gi.test(type);
    let questionList = [],  // Final questions list,
        operation = type.split("_")[0],
        _amount = parseInt(_amount), // Amount of questions
        controlList = [], // Array of controls, 1 for each question
        changingControl = null,  // Control iterator (-10,10)
        wrongControls = [], // Array of 'wrong controls' for wrong answers
        primaryRange = getPrimaryRange(type),    // First part ([RANGE] number to start with)
        secondaryRange = getSecondaryRange(type) // Second Constant (if exists)
    /*
        Create Control number list >>
        for the operations
    */
    controlList = generateControlList([], amount, type);
    wrongControls = generateWrongControls([]);
    for (var i=0;i<amount;i++) {
        // Populate the question object
        let obj = _.cloneDeep(questionObject);
        obj.id = Random.id(7);
        obj.control = controlList[i];
        if (hasChanger)
            changingControl = _.random(-10,10);
        // PARTS        
        let primary = _.random(...primaryRange);
        obj.parts.push(primary);
        console.log('obj.control >> ', obj.control);
        // console.log('changingControl >> ', changingControl);
        let control = null;
        for (var k = 0;k<6;k++) {
            let iter = !!changingControl ? k * changingControl : 0;
            control = _[operation](obj.control, iter);
            console.log('iter >> ', iter);
            console.log('control >> ', control);
            obj.parts.push(_[operation](_.last(obj.parts), control))
        }
        // ANSWERS
        // take last part as the answer
        // And remove it from parts array
        obj.answers.correct = _.last(obj.parts);
        obj.parts.pop();
        obj.answers.list.push(obj.answers.correct)
        for (var j=0;j<3;j++) {
            // -3 -- 3 from correct answer
            obj.answers.list.push(_.add(obj.answers.correct, wrongControls[j]))
        }
        questionList.push(obj);
    }
    return questionList;
}


function generateWrongControls(controls) {
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