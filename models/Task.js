const mongoose = require('mongoose');

const TaskStateSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    value: { type: Number, required: true },
    severity: { type: String, required: true }
}, { collection: 'task_state' });

const TaskSchema = new mongoose.Schema({
    estimated_duration: { type: Number},
    date_start: { type: Date, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // pour la modification de User_id
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quote_details_id: { type: mongoose.Schema.Types.ObjectId, ref: "PrestationBrand"}, // ajout de quote_details_id
    quote_details: { type: mongoose.Schema.Types.ObjectId, ref: "PrestationBrand"},
    task_state_id: { type: mongoose.Schema.Types.ObjectId, required: true},
    task_state: { type: mongoose.Schema.Types.ObjectId}
}, { collection: 'task' }, { timestamps: true });

module.exports = { 
    TaskState: mongoose.model('TaskState', TaskStateSchema),
    Task: mongoose.model('Task', TaskSchema),
};
