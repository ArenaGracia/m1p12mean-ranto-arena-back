const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { QuoteState } = require('../models/Quote');

router.get("/quote", async (req, res) => {
    try {
        const states = await QuoteState.find(); 
        res.status(200).json(states);
    } catch (error) {
        res.status(500).json({ message: "Error during getting the Quote state: " + error.message });
    }
});

module.exports = router;