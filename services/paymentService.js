const { Payemnt } = require("../models/Payment");
const { mongoose } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { updateQuoteState } = require("../services/quoteService");
const { Payment } = require("../models/Payment");

async function createPayment (payment, amountLeft) {
    if (payment.amount > amountLeft) {
        throw new Error("Le montant du paiement est supérieur à la somme restante");
    } else if (payment.amount == amountLeft) { 
        // mettre à jour l'etat du devis comme payé
        await updateQuoteState(payment.quote_id, 5);
    }
    const newPayment = new Payment(payment);
    return newPayment.save();
}

module.exports = {
    createPayment
}