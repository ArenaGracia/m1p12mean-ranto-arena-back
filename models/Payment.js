const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    quote_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' }
}, { collection: "payment"}, { timestamps: true });


module.exports = { 
    Payment: mongoose.model('Payment', PaymentSchema),
};

