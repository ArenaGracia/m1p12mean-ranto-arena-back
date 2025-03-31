const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    prestations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'prestation' }]
}, { collection: 'category' });

const PrestationSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    description: { type: String, required: true }, 
    image: { type: Buffer, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true } 
}, { collection: 'prestation' });

module.exports = {
    Category: mongoose.model("Category", CategorySchema),
    Prestation: mongoose.model('Prestation', PrestationSchema),
};
