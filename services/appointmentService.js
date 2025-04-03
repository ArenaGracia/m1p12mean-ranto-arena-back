const { default: mongoose } = require("mongoose");
const {Appointment} = require('../models/Appointment');

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



module.exports = {
    getAppointmentsForCalendar
}