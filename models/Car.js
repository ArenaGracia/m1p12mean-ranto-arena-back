const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, {collection: "brand", timestamps: true });

const CarSchema = new mongoose.Schema({
    license_plate_number: { type: String, required: true },
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    brand_id: {type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true}
}, {collection: "car", timestamps: true });

module.exports = {
    Brand: mongoose.model("Brand", BrandSchema),
    Car: mongoose.model('Car', CarSchema),
};