import shortid from 'shortid'
export function questionGenerator(category, type, amount) {
    if (category=='series') {
        let seriesQuestionList = []
        if (type=='add') {
            return generateAddition(amount, type);
        }
    }
}

function generateAddition(amount, type) {
    console.log('generate addition.. ', amount);
    let questionList = [],
        questionObj = {
            id: null,
            parts: [],
            answers: {
                correct: null,
                list:[]
            },
            control: null,
            operation: 'add',
            chosenAnswer: null

        },
        _amount = parseInt(_amount),
        controlList = [],
        wrongControls = []

    // Control number to operate on
    while (controlList.length<amount) {
        let control = _.random(-20,20)
        controlList.push(control);
        controlList = _.uniq(_.compact(controlList));
    }
    while(wrongControls.length<3) {
        wrongControls.push(_.random(-3,3));
        wrongControls = _.uniq(_.compact(wrongControls));
    }
    for (var i=0;i<amount;i++) {

        // Populate the question object
        let obj = _.cloneDeep(questionObj);
        obj.id = shortid.generate();
        let primary = _.random(0,9);
        obj.control = controlList[i];
        for (var k = 0;k<5;k++) {
            obj.parts.push(_[type](primary, (obj.control*(k+1))))
        }
        
        obj.answers.correct = _[type](_.last(obj.parts), obj.control);
        obj.answers.list.push(obj.answers.correct)
        for (var j=0;j<3;j++) {
            obj.answers.list.push(_[type](_.last(obj.parts), obj.control+wrongControls[j])); 
        }
        
        console.log("obj >> ", obj);
        questionList.push(obj);
    }
    return questionList;
}