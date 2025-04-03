const { QuoteState } = require('../models/Quote');
const { TaskState } = require('../models/Task');

async function getQuoteStateByValue(stateValue) {
    const state = await QuoteState.findOne({ value: stateValue });
    if (!state) {
        throw new Error(`Quote state of value ${stateValue} not found`);
    }
    return state;
}

async function getTaskStateByValue(stateValue) {
    const state = await TaskState.findOne({ value: stateValue });
    if (!state) {
        throw new Error(`TaskState state of value ${stateValue} not found`);
    }
    return state;
}

module.exports = {
    getQuoteStateByValue,
    getTaskStateByValue
}