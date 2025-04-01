const express = require('express');
const { createPayment } = require('../services/paymentService');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const payment = await createPayment(req.body.payment, req.body.amountLeft);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


module.exports = router;