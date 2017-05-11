import SeriesQuestionGenerator from './series/generate'
import { Questions } from '/imports/api/collections/questions'
export function questionGenerator(category, type, label, amount) {
    console.log('question generator >> ', category);
    if (category=='series') {
        return SeriesQuestionGenerator(type, label, amount);
    }
    else {
        return generate(type, label, amount);
    }
}

function generate(type, label, amount) {
    console.log(...arguments);
}