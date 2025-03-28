const express = require('express');
const router = express.Router();

const { QuoteState, Quote } = require('../models/Quote');
const { addDiscount, getQuotesByState, getQuoteById, updateQuoteState } = require('../services/quoteService');

// prendre toutes les devis
router.get('/', async (req, res) => {
    try {
       const quotes = await Quote.find();
       res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// prendre par id
router.get('/:id', async (req, res) => {
    try {
       const quotes = await getQuoteById(req.params.id);
       res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// prendre les devis par etat
router.get('/state/:state', async (req, res) => {
    try {
        const quotes = await getQuotesByState(req.params.state);
        res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// valider un devis
router.put('/validate/:id', async (req, res) => {
    try {
        const quotes = await updateQuoteState(req.params.id, 3);
        res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// rejeter un devis
router.put('/decline/:id', async (req, res) => {
    try {
        const quotes = await updateQuoteState(req.params.id, 4);
        res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// ajouter une remise
router.put('/discount/:id', async (req, res) => {
    try {
        const { discount } = req.body;
        if (!discount) {
            return res.status(400).json({ message: "La valeur de la remise est requise." });
        }
        const quotes = await addDiscount(req.params.id, discount);
        res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/states', async (req, res) => {
    try {
       const quotes = await QuoteState.find();
       res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;