import SeriesQuestionGenerator from './series/generate'
import { Questions } from '/imports/api/collections/questions'
export function questionGenerator(category, type, label, amount, questionsbank) {
    console.log('question generator >> ', category);
    if (category=='series') {
        return SeriesQuestionGenerator(type, label, amount);
    }
    else {
        return generate(category, type, label, amount, questionsbank);
    }
}

function generate(category, type, label, amount, questionsbank) {
    console.log("[questionGenerator] !isNaN(amount) >> ", !isNaN(amount), amount);
    let questionlist = [];
    let questions = _.shuffle(questionsbank.questions);
    if (!isNaN(amount)) {
        console.log("AMOUNT ??? ", amount);
        // Amount is an integer
        let filteredQuestions;
        if (category==='matrices') {
            filteredQuestions = _.filter(questions, q => q.code===label );
        }
        else {
            filteredQuestions = _.filter(questions, q => q.type.value===type );
        }
        console.log('filteredQuestions > ', filteredQuestions);
        for (var i = 0; i<filteredQuestions.length;i++) {
            if(questionlist.length<amount) {
                questionlist.push(filteredQuestions[i]);
            }
            else break;
        }
        
    }
    else {
        // Amount is array of code:amount
        let codes = amount;
        codes = _.filter(codes.list, code => !!code.amount);
        for (var i = 0; i< codes.length; i++) {
            let obj = codes[i];
            let questionsByCode = _.filter(questions, q => q.code===obj.code);
            for (var j = 0; j<obj.amount;j++) {
                questionlist.push(questionsByCode[j]);
            }
        }
    }
    console.log('generated questionslist : ', questionlist)
    return questionlist;    
}