import { Random } from 'meteor/random'

const questionObject =  {
    id: null,
    type: null,
    label: null,
    parts: [],
    answers: {
        correct: null,
        list:[]
    },
    controls: [],
    shifts: [],
    operations: [],
    chosenAnswer: null
}

export default function generate(type, label, amount) {
    let questionList = [];  // Final questions list,
    let params = getParameters(amount, type);

    // Create Questions <<<<<<<<
    for (var i=0;i<amount;i++) {
        // Init question object
        let obj = generateQuestion(i, type, label, params); 
        // ANSWERS
        obj.answers = generateAnswers(obj.parts, params);
        questionList.push(obj);
    }
    return questionList;
}

function generateQuestion(index, type, label, params) {
    let question = _.cloneDeep(questionObject);
    question.id = Random.id(7);
    question.type = type;
    question.label = label;
    question.parts = generateQuestionParts(question, params);
    return question;
}
function populateQuestionObj(question, constants, shift, operations) {
    if (question.type==='add_multiply_shift_double') {

    console.log('populateQuestionObj>>> ', operations);
    }
    question.controls.push(...constants);
    question.shifts.push(shift);
    question.operations.push(...operations);
    if (question.type==='add_multiply_shift_double') {

    console.log('populateQuestionObj>>> ', operations);
    console.log('question.operations>>> ', question.operations);
    }
}
function generateQuestionParts(question, params) {
    console.log("params..", params)
    // let _params = _.clone(params),
    let sequenceAmount = params.length,
    parts = [],
    shift = generateShifts(params),
    
    // control = _.clone(question.control),
    totalAmountOfParts = _.sum(_.map(params, 'partsAmount')); //params.partsAmount + params.length;
    // question.shift = shift; 
    /*
        Generate sequence/s for series.
    */
    let sequences = [];
    for (var i = 0; i< sequenceAmount; i++) {
        if (params[i].operation==='fibonacci') {
            sequences.push(generateFibonacciSequence(params[i]));
        }
        else {
            sequences.push(generateSequence(question, shift[i],params[i]));
        }
    }
    for (var k = 0;k<totalAmountOfParts;k++) {
            let index = k%sequenceAmount;
            parts.push(sequences[index][(k-index)/sequenceAmount])
    }
    return parts;
}

/* 
    GENERATE SEQUENCE: returns Array
*/
function generateSequence(question, shift, params) {
    console.log("SHIFT << ", shift);
    let sequenceparts = [];
    let constants = [],
    // for power shifts
    powconstant = null;

    let operationIndex = 0,
    operations = params.operation;
    for (var o = 0; o< operations.length; o++) {
        constants.push(generateSequenceConstant(params.generateConstant))
    }
    /* Feed controls / shift back to questionObject for later processing */
    console.log("GENERATE SEQUENCE:: params >> ", params, " :: shift >> ", shift, " :: constants >> ",constants, " :: operations >> ", operations);
    populateQuestionObj(question, _.clone(constants), shift, operations);

    powconstant = constants[operationIndex];
    for (var i=0; i< params.partsAmount; i++) {
        let constant = constants[operationIndex],
        operation = operations[operationIndex];
        if (i===0) {
            // first Number
            sequenceparts.push(params.firstNumeric(constant));
        }
        else {
            let lastpart = _.last(sequenceparts);
            let nextValue = _[operation](lastpart, constant)
            /* 
                Make sure DIVIDE operations don't create a mess
            */
            while (operation==='divide' && Math.abs(lastpart)%constant!=0) {
                let fixoperation = 'add';
                if (Math.abs(constant) > Math.abs(lastpart)) {
                    fixoperation = (constant > lastpart) ? 'subtract' : 'add';
                }
                constant = _[fixoperation](constant, 1);
                nextValue = _[operation](lastpart, constant);
                constants[operationIndex] = constant;
            }
            sequenceparts.push(nextValue);
            if (shift==='power') {
                console.log(constants[operationIndex], " :: ", powconstant);
                constants[operationIndex] = _.multiply(constants[operationIndex], powconstant)
            }
            else {
                constants[operationIndex] += shift;
            }
            operationIndex = operationIndex===operations.length-1 ? 0 : ++operationIndex;
        }
    }
    console.log("sequenceparts >> ", sequenceparts);
    return sequenceparts;
}
function generateFibonacciSequence(params) {
    let sequenceparts = [];
    for (var i=0; i< params.partsAmount; i++) {
        if (i===0) {
            // first two numbers
            sequenceparts.push(...params.firstNumeric());
        }
        else {
            let lastTwoParts = sequenceparts.slice(Math.max(sequenceparts.length - 2, 0));
            sequenceparts.push(_.add(...lastTwoParts));
        }
    }    
    return sequenceparts;
}
/*
    Invokes the constant generator for each sequence
*/
function generateSequenceConstant(sequenceGenerator) {
    let generator = sequenceGenerator,
    control = generator.next().value;
    generator.next(control)
    return control
}
/*
    GENERATOR: returns next constant
*/
function* constantGenerator(controls, range, exclude, amount, type, unique) {
    let control = null; 
    while (!control) {
        let _control = _.random(...range);
        if (exclude.indexOf(_control)<0 && !(!!unique && controls.indexOf(_control)>-1)) {
            control = _control;
            let savedcontrol = yield control;
            controls.push( savedcontrol );
        }
    }
}
/*
    GENERATE SHIFTS: return Array
*/
function generateShifts(params) {
    let arr = [];
    for (var i = 0; i<params.length; i++) {
        arr.push(!!params[i].shift ? params[i].shift() : 0)
    }
    return arr;
}
/*
    GENERATE NUMBER: returns Number
*/
function generateNumber(range, exclude = [], amount, operation, constant) {
    console.log('get number constant >> ', constant)
    let number = _.random(...range);
    while (exclude.indexOf(number)>-1) {
        number = _.random(...range);
    }
        console.log("OPERATION >", operation);
    
    if (!!operation && operation.indexOf('divide')>-1) {
        // start from end.
        for (var i=0; i<amount; i++) {
            number = number*constant;
        }
    }
    console.log('number: ', number);
    return number;
}



/*
    ANSWERS: generate answer choices
*/
function generateAnswers(parts, params) {
    let list = [];
    let correct = null;
    for (var i = 0; i < params.length; i++) {
        let amount = params[i].answersAmount-1; // to 0 based
        let wrongControls = generateWrongControls([]);
        correct = _.last(parts);
        list.push(correct);
        parts.pop();
        for (var j=0;j<amount;j++) {
            let nextVal = _.add(correct, wrongControls[j]);
            while (list.indexOf(nextVal)>-1) ++nextVal
            list.push(nextVal);
        }  
        // list = _.shuffle(list)
    }
    if (_.uniq(list).length !== list.length) {
        console.log("correct < ", correct);
        console.log("1 list < ", list);
        
        list = _.uniq(list);
        list.push(_.min(list)-1);

        console.log("2 list < ", list);
    }
    return {
        correct,
        list
    }
}

/*
    returns array
*/
function generateWrongControls(controls) {
    while(controls.length<3) {
        controls.push(_.random(-3,3));
        controls = _.uniq(_.compact(controls));
    }
    return controls;
}

/*
    PARAMETERS: for sequences

*/
function getParameters(amount, type) {
    let operation = [type.split("_")[0]];
    switch (type) {
        case 'add':
            return [{
                operation,
                firstNumeric: () => generateNumber([0,100]),
                controls: [],
                get generateConstant() {
                    return  constantGenerator(this.controls, [1,20], [], amount, type, true)
                },
                partsAmount: 6,
                answersAmount: 4,
            }]
        case 'subtract':
            return [{
                operation,
                firstNumeric: () =>  generateNumber([-100,100]),
                controls: [],
                get generateConstant() {
                    return  constantGenerator(this.controls, [1,20], [], amount, type)
                },
                partsAmount: 6,
                answersAmount: 4,
            }]
        case 'multiply':
        case 'divide':
            return [{
                operation,
                firstNumeric: (constant) =>  generateNumber([-5,5], [0], 5, operation, constant),
                controls: [],
                get generateConstant() {
                    return  constantGenerator(this.controls, [-3,3], [0,1,-1], amount, type)
                },
                partsAmount: 5,
                answersAmount: 4,
            }]
        case 'add_shift':
        case 'subtract_shift':
            return [{
                operation,
                firstNumeric: () =>  generateNumber([-100,100]),
                controls: [],
                get generateConstant() {
                    return  constantGenerator(this.controls, [1,20], [], amount, type)
                },
                shift: () => generateNumber([-10,10], [0]),
                partsAmount: 6,
                answersAmount: 4,
            }]
        case 'multiply_shift':
            return [{
                operation,
                firstNumeric: () =>  generateNumber([-3,3], [0]),
                controls: [],
                get generateConstant() {
                    return  constantGenerator(this.controls, [1,3], [], amount, type)
                },
                shift: () => generateNumber([1,3]),
                partsAmount: 5,
                answersAmount: 4,
            }]
        case 'add_double':
        case 'subtract_double':
            return [
                {
                    operation,
                    firstNumeric: () =>  generateNumber([0,9]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-20,20], [], amount, type)
                    },
                    partsAmount: 4,
                    answersAmount: 2,
                },
                {
                    operation,
                    firstNumeric: () =>  generateNumber([0,9]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-20,20], [0], amount, type)
                    },
                    partsAmount: 3,
                    answersAmount: 2,
                },               
            ]
        case 'multiply_double':
        case 'divide_double':
            return [
                {
                    operation,
                    firstNumeric: (constant) =>  generateNumber([1,9], [], 3, operation, constant),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-10,10], [0], amount, type)
                    },
                    partsAmount: 4,
                    answersAmount: 2,
                },
                {
                    operation,
                    firstNumeric: (constant) =>  generateNumber([1,9], [], 2, operation, constant),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-5,5], [0], amount, type)
                    },
                    partsAmount: 3,
                    answersAmount: 2,
                },               
            ]
        case 'add_multiply_double':
            return [
                {
                    operation: ['add'],
                    firstNumeric: () =>  generateNumber([0,9]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-20,20], [], amount, type)
                    },
                    partsAmount: 4,
                    answersAmount: 2,
                },
                {
                    operation: ['multiply'],
                    firstNumeric: () =>  generateNumber([1,9]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-10,10], [0], amount, type)
                    },
                    partsAmount: 3,
                    answersAmount: 2,
                },
            ]
        case 'add_multiply_shift_double':
            return [
                {
                    operation: ['add'],
                    firstNumeric: () =>  generateNumber([1,9]),
                    shift: () => generateNumber([1,3]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [1,10], [], amount, type)
                    },
                    partsAmount: 4,
                    answersAmount: 2,
                },
                {
                    operation: ['multiply'],
                    firstNumeric: () =>  generateNumber([1,9]),
                    shift: () => generateNumber([1,3]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-5,5], [0], amount, type)
                    },
                    partsAmount: 4,
                    answersAmount: 2,
                },
            ]
        case 'all_triple':
            return [
                {
                    operation: ['add', 'multiply', 'divide'],
                    firstNumeric: () =>  generateNumber([1,9]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-5,5], [-1,0,1], amount, type)
                    },
                    partsAmount: 6,
                    answersAmount: 4,
                }
            ]
            case 'all_quad':
            return [
                {
                    operation: ['add', 'multiply', 'add', 'divide'],
                    firstNumeric: () =>  generateNumber([1,9]),
                    controls: [],
                    get generateConstant() {
                        return  constantGenerator(this.controls, [-5,5], [-1,0,1], amount, type)
                    },
                    partsAmount: 7,
                    answersAmount: 4,
                }
            ]
        case 'add_power_shift':
            return [{
                operation,
                firstNumeric: () =>  generateNumber([1,9]),
                controls: [],
                get generateConstant() {
                    return  constantGenerator(this.controls, [2,5], [], amount, type)
                },
                shift: () => {return 'power'},
                partsAmount: 5,
                answersAmount: 4,
            }]
        case 'multiply_power_shift':
            return [{
                operation,
                firstNumeric: () =>  generateNumber([2,9]),
                controls: [],
                get generateConstant() {
                    return  constantGenerator(this.controls, [2,4], [], amount, type)
                },
                shift: () => {return 'power'},
                partsAmount: 4,
                answersAmount: 4,
            }]
        case 'fibonacci':
            return [{
                operation: 'fibonacci',
                firstNumeric: () => { return [generateNumber([0,9]), generateNumber([1,9])]},
                partsAmount: 6,
                answersAmount: 4,
            }]
        default:
            return [{
                firstNumeric: () =>  generateNumber([-100,100]),
                constantRange: [1,20],
                partsAmount: 6
            }]
    }
}