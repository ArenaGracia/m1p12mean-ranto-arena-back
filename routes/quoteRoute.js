const express = require('express');
const router = express.Router();

const { QuoteState, Quote } = require('../models/Quote');
const { getQuotesByState, getQuoteById, updateQuoteState, addDiscount } = require('../services/quoteService');

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
        console.log('discount :' + req.body.discount + ' id' + req.params.id);
        const UpdatedQuote = await addDiscount(req.params.id, req.body.discount);
        res.status(201).json(UpdatedQuote);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Error during updating the discount :' + error.message});
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