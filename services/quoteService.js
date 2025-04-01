const { Quote } = require('../models/Quote');
const { getStateByValue } = require('./quoteStateService');
const { default: mongoose } = require('mongoose');

async function getQuotesByState(stateValue) {
    try {
        const state = await getStateByValue(stateValue);
        return await mongoose.connection.db.collection("v_quote_libcomplet").find({ "quote_state._id": state._id }).toArray();
    } catch (error) {
        throw new Error(`Error during getting the quote : ${error.message}`);
    }
}

// Devis et details devis
async function getQuoteById(quoteId) {
    const quote = await mongoose.connection.db.collection("v_quote_libcomplet")
    .aggregate([
        { $match: { _id: new ObjectId(quoteId) } },
        { $lookup: {
            from: "v_quote_details_libcomplet", localField: "_id", foreignField: "quote_id", as: "quote_details"
        }},
        { $project: { "quote_details.quote_id": 0 } }
    ])
    .toArray();
    return quote[0];
}

async function getQuotesByUser(userId) {
    try {
        return await mongoose.connection.db.collection("v_quote_libcomplet")
                        .find({ "appointment.user._id": new mongoose.Types.ObjectId(userId) })
                        .toArray();
    } catch (error) {
        throw new Error(`Error during getting the quote : ${error.message}`);
    }
}

async function updateQuoteState(quoteId, value) {
    try {
        const state = await getStateByValue(value);
        if (state.value === 3) return "Cette devis est déjà validé";
        const updatedQuote = await Quote.findByIdAndUpdate(
            quoteId,
            { quote_state_id: state._id },
            { new: true, runValidators: true }
        );
        return updatedQuote;
    } catch (error) {
        console.log(error);
        throw new Error(`Error during getting the quote : ${error.message}`);
    }
}

async function addDiscount(quoteId, discount) {
    try {
        const quote = await Quote.findById(quoteId);
        quote.discount = discount;
        return await quote.save();
    } catch (error) {
        throw new Error(`Error during updating the discount : ${error.message}`);
    }
}

async function validateNewDate (quoteId, newDate) {
    const quote = await updateQuoteState(quoteId, 2);
    const appointment = await Appointment.findByIdAndUpdate(
        quote.appointment_id,
        { time_start: new Date(newDate) },
        { new: true, runValidators: true }
    );
    return {quote, appointment};
}



module.exports = {
    getQuotesByState,
    updateQuoteState,
    addDiscount,
    getQuoteById,
    getQuotesByUser
}

