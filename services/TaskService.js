const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { Appointment } = require('../models/Appointment');
const {Task, TaskState} = require('../models/Task');
const { Quote } = require('../models/Quote');
const { getTaskStateByValue } = require('../services/stateService');

async function getTasks(page = 0, size = 10, stateId, userId, startDate, endDate, categoryId) {
    const skip = page * size;
    const filter = {};

    if (stateId)
        filter["task_state_id"] = new mongoose.Types.ObjectId(stateId);

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
    const taskState = await getTaskStateByValue(1);
    const tasks = quoteDetails.map(detail => {
        const task = new Task({
            task_state_id: taskState._id,
            date_start: new Date(dateStart),
            quote_details_id: detail._id
        });
        dateStart.setMinutes(dateStart.getMinutes() + detail.prestation_brand.duration);
        return task.save();
    });
    await Promise.all(tasks);
}

async function endTask(taskId, estimated_duration) {
    const taskState = await getTaskStateByValue(3);
    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { task_state_id: taskState._id, estimated_duration: estimated_duration },
        { new: true, runValidators: true }
    );
    return updatedTask;
}

module.exports = {
    createTasks,
    getTasks,
    getNonAffectedTasks,
    endTask
}