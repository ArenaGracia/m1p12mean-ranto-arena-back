const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    prestations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'prestation' }]
}, { collection: 'category' });

const PrestationBrandSchema = new mongoose.Schema({
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'brand'},
    prestation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'prestation' },
    duration: {type: Number, required: true},
    price: {type: mongoose.Schema.Types.Double, required: true}
}, { collection: 'prestation_brand' });

const PrestationSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    description: { type: String, required: true }, 
    image: { type: Buffer, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true } 
}, { collection: 'prestation' });

module.exports = {
    Category: mongoose.model("Category", CategorySchema),
    Prestation: mongoose.model('Prestation', PrestationSchema),
    PrestationBrand: mongoose.model('PrestationBrand', PrestationBrandSchema),
};
