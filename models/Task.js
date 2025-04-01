const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    estimatedDuration: { type: Number, map:"estimated_duration"},
    date_start: { type: Date, map:"date_start", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, map:"user_id", ref: "User" },
    prestation_brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "PrestationBrand"},
    prestation_brand: { type: mongoose.Schema.Types.ObjectId, ref: "PrestationBrand"},
    state: { type: Number, required: true}
}, { collection: 'task' }, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);