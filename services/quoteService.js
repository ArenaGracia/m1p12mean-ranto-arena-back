const { Quote } = require('../models/Quote');
const { getQuoteStateByValue } = require('./stateService');
const { default: mongoose } = require('mongoose');
const { ObjectId } = mongoose.Types;
const { Appointment } = require('../models/Appointment');
const {createTasks} = require('../services/TaskService');

async function getQuotesByState(stateValue) {
    try {
        const state = await getQuoteStateByValue(stateValue);
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
                        .find({ "appointment.user._id": new ObjectId(userId) })
                        .toArray();
    } catch (error) {
        throw new Error(`Error during getting the quote : ${error.message}`);
    }
}

async function updateQuoteState(quoteId, value) {
    try {
        const state = await getQuoteStateByValue(value);
        const updatedQuote = await Quote.findByIdAndUpdate(
            quoteId,
            { quote_state_id: state._id },
            { new: true, runValidators: true }
        );
        if (value === 3) { // si on va valider le devis, créer les tâches
            await createTasks(quoteId);
        }
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
    getQuotesByUser,
    validateNewDate
}

