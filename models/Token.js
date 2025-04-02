const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
    valeur: { type: String, required: true },
    created_date: { type: Date, required: true },
    expiration_Date: { type: Date, required: true },
}, { collection: 'token_user' }, { timestamps: true });

module.exports = {
    Token: mongoose.model("Token", TokenSchema)
};