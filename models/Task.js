const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    estimatedDuration: { type: Number, map:"estimated_duration", required: true},
    dateStart: { type: Date, map:"date_start", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, map:"user_id", ref: "User", required: true },
    prestationBrand: { type: mongoose.Schema.Types.ObjectId, map:"prestation_brand_id", ref: "Prestation", required: true},
    state: { type: Number, required: true}
}, { collection: 'task' }, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);