const express = require('express');
const { createPayment, getPaymentSummary, getTotalRevenue, getDailyRevenue, getMonthlyRevenue } = require('../services/paymentService');
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

router.get('/revenue/total', async (req, res) => {
    try {
        const start = new Date(req.query.dateStart);
        const end = new Date(req.query.dateEnd);
        const totalRevenue = await getTotalRevenue(start, end);
        res.json ({ totalRevenue : totalRevenue});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/revenue/daily', async (req, res) => {
    try {
        const start = new Date(req.query.dateStart);
        const end = new Date(req.query.dateEnd);
        const dailyRevenue = await getDailyRevenue(start, end);
        res.json ({dailyRevenue : dailyRevenue});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/revenue/monthly', async (req, res) => {
    try {
        const start = new Date(req.query.dateStart);
        const end = new Date(req.query.dateEnd);
        const dailyRevenue = await getMonthlyRevenue(start, end);
        res.json ({dailyRevenue : dailyRevenue});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;