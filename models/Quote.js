
const mongoose = require('mongoose');

const QuoteStateSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    value: { type: Number, required: true },
    severity: { type: String, required: true }
}, { collection: 'quote_state' });

const QuoteSchema = new mongoose.Schema({
    totalPrice: { type: Number, map: "total_price", required: true },
    discount: { type: Number, required: true },
    quoteState: { type: mongoose.Schema.Types.ObjectId, map: "quote_state_id", ref: "QuoteState", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { collection: 'quote' }, { timestamps: true });

const QuoteDetailsSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    prestationBrand: { type: mongoose.Schema.Types.ObjectId, map:"prestation_brand_id", ref: "PrestationBrand", required: true },
    quote: { type: mongoose.Schema.Types.ObjectId, ref: "Quote", required: true }
}, { collection: 'quote_details' }, { timestamps: true });


module.exports = {
    QuoteState: mongoose.model("QuoteState", QuoteStateSchema),
    Quote: mongoose.model('Quote', QuoteSchema),
    QuoteDetails: mongoose.model('QuoteDetails', QuoteDetailsSchema)
};
