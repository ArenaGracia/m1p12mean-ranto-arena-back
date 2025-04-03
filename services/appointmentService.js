const { default: mongoose } = require("mongoose");
const {Appointment} = require('../models/Appointment');
const { getPaymentSummary } = require('../services/paymentService');
const { getAppointmentStateByValue } = require('../services/stateService');

async function getAppointmentsForCalendar(startDate, endDate) {
    console.log("Prendre les rendez-vous entre : " + startDate + " à " + endDate);

    let filter = {};
    if (startDate && endDate) {
        filter["appointment.time_start"] = {};
        if (startDate) filter["appointment.time_start"].$gte = new Date(startDate);
        if (endDate) filter["appointment.time_start"].$lte = new Date(endDate);
    } else { throw new Error("Definissez les intervalles de dates") }

    const quotes = await mongoose.connection.db.collection("v_quote_libcomplet").find(filter).toArray();

    return quotes.map(quote => ({
        id: quote._id,
        title: quote.appointment.user.name + " " + quote.appointment.user.first_name,
        start: quote.appointment.time_start
    }));
}

async function endAppointment (idAppointment, quoteId, amountLeft) {
    if (!amountLeft && quoteId) {
        const summary = await getPaymentSummary(quoteId);
        amountLeft = summary.amount_remaining;
    }
    if (amountLeft != 0)
        throw new Error("Il reste encore " + amountLeft + " Ar à payer");
    const state = await getAppointmentStateByValue(3);
    return await Appointment.findByIdAndUpdate(
        idAppointment,
        { state_appointment_id: state._id },
        { new: true, runValidators: true }
    );
}

module.exports = {
    getAppointmentsForCalendar,
    endAppointment
}