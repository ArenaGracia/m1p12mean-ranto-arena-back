const { QuoteState, Quote } = require('../models/Quote');
const { getStateByValue } = require('./quoteStateService');

async function getQuotesByState(stateValue) {
    try {
        const state = await getStateByValue(stateValue);
        return await Quote.find({ quoteState: state._id }).populate("quoteState").populate("user").populate("prestationBrand");
    } catch (error) {
        throw new Error(`Error during getting the quote : ${error.message}`);
    }
}

async function updateQuoteState(quoteId, value) {
    try {
        const state = await getStateByValue(value);
        const updatedQuote = await Quote.findByIdAndUpdate(
            quoteId,
            { state },
            { new: true, runValidators: true }
        ).populate("quoteState");
        return updatedQuote;
    } catch (error) {
        throw new Error(`Error during getting the quote : ${error.message}`);
    }
}

async function addDiscount(quoteId, discount) {
    try {
        const updatedQuote = await Quote.findByIdAndUpdate(
            req.params.id,
            { discount },
            { new: true, runValidators: true }
        );
        return updatedQuote;
    } catch (error) {
        throw new Error(`Error during updating the discount : ${error.message}`);
    }
}

module.exports = {
    getQuotesByState,
    updateQuoteState,
    addDiscount
}

