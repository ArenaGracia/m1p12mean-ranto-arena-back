const { Quote } = require('../models/Quote');
const { Appointment} = require('../models/Appointment');
const { getStateByValue } = require('./quoteStateService');

async function getQuotesByState(stateValue) {
    try {
        const state = await getStateByValue(stateValue);
        return await Quote.find({ quote_state_id: state._id }).populate({
                path: "appointment_id",
                populate: {
                    path: "user_id",
                    select: "name first_name"
                },
                select: "user_id time_start" 
            })
            .populate({
                path: "quote_state_id",
                select: "value"
            })
            .select("total_price discount appointment_id quote_state_id");
    } catch (error) {
        throw new Error(`Error during getting the quote : ${error.message}`);
    }
}

async function getQuoteById(quoteId) {
    try {
        return await Quote.findOne({ _id: quoteId }).populate({
            path: "appointment_id",
            populate: {
                path: "user_id",
                select: "name first_name"
            },
            select: "user_id time_start time_end" 
        })
        .populate({
            path: "quote_state_id",
            select: "value"
        })
        .select("total_price discount appointment_id quote_state_id");;
    } catch (error) {
        throw error;
    }
}

async function updateQuoteState(quoteId, value) {
    try {
        const state = await getStateByValue(value);
        const updatedQuote = await Quote.findByIdAndUpdate(
            quoteId,
            { quote_state_id: state._id },
            { new: true, runValidators: true }
        ).populate("quote_state_id");
        return updatedQuote;
    } catch (error) {
        console.log(error);
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
    addDiscount,
    getQuoteById
}

