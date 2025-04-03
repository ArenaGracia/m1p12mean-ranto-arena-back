const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { Appointment } = require('../models/Appointment');
const {Task} = require('../models/Task');
const { Quote } = require('../models/Quote');

async function getTasks(page = 0, size = 10, state, userId, startDate, endDate, categoryId) {
    const skip = page * size;
    const filter = {};

    if (state)
        filter["state"] = state;

    if (userId)
        filter["user._id"] = new mongoose.Types.ObjectId(userId);

    if (startDate || endDate) {
        filter["date_start"] = {}; 
        if (startDate) filter["date_start"].$gte = new Date(startDate);
        if (endDate) filter["date_start"].$lte = new Date(endDate);
    }

    if (categoryId)
        filter["prestation_brand.prestation.category._id"] = new mongoose.Types.ObjectId(categoryId);

    const tasks = await mongoose.connection.db.collection("v_task_libcomplet")
        .find(filter)
        .skip(skip) // debut
        .limit(Number(size)) // fin
        .toArray();
    return tasks;
}

async function getNonAffectedTasks(page = 0, size = 10) {
    const skip = page * size;
    const tasks = await mongoose.connection.db.collection("v_task_libcomplet")
        .find({user: null})
        .skip(skip) // debut
        .limit(Number(size)) // fin
        .toArray();
    return tasks;
}

async function createTasks(quoteId) {
    const quoteDetails = await mongoose.connection.db.collection("v_quote_details_libcomplet").find({ "quote_id": new ObjectId(quoteId) }).toArray();
    const quote = await Quote.findById(quoteId).populate("appointment_id");
    const dateStart = new Date(quote.appointment_id.time_start);
    const tasks = quoteDetails.map(detail => {
        console.log("details id : " + detail._id);
        const task = new Task({
            state: 0,
            date_start: new Date(dateStart),
            // prestation_brand_id: detail.prestation_brand._id
            quote_details_id: detail._id
        });
        dateStart.setMinutes(dateStart.getMinutes() + detail.prestation_brand.duration);
        return task.save();
    });
    await Promise.all(tasks);
}

module.exports = {
    createTasks,
    getTasks,
    getNonAffectedTasks
}