const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    estimated_duration: { type: Number},
    date_start: { type: Date, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // pour la modification de User_id
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    prestation_brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "PrestationBrand"}, // ajout de prestation_brand_id
    prestation_brand: { type: mongoose.Schema.Types.ObjectId, ref: "PrestationBrand"},
    state: { type: Number, required: true}
}, { collection: 'task' }, { timestamps: true });

module.exports = { 
    Task: mongoose.model('Task', TaskSchema),
};
