const { QuoteState } = require('../models/Quote');

async function getStateByValue(stateValue) {
    const state = await QuoteState.findOne({ value: stateValue });
    if (!state) {
        throw new Error(`Quote state of value ${stateValue} not found`);
    }
    return state;
}

module.exports = {
    getStateByValue
}