const express = require('express');
const { createPayment, getPaymentSummary } = require('../services/paymentService');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const payment = await createPayment(req.body.payment, req.body.amountLeft);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// prendre les montants total payé, le montant total à payer et le montant restant à payer
router.get('/summary/:quoteId', async (req, res) => {
    try {
        const summary = await getPaymentSummary(req.params.quoteId);
        res.json(summary);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;