const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getQuotesByState, updateQuoteState, addDiscount, getQuoteById, getQuotesByUser } = require('../services/quoteService');
const { sendEmail } = require('../services/emailService');
const { getAppointmentStateByValue } = require('../services/stateService');
const { Appointment } = require('../models/Appointment');

// prendre toutes les devis
router.get('/', async (req, res) => {
    try {
       const quotes = await mongoose.connection.db.collection("v_quote_libcomplet").find().toArray();
       res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// prendre par id de l'user
router.get('/client' , async (req, res) => {
    try {
        const userId = req.user["id"];
        const quotes = await getQuotesByUser(userId);
    res.status(201).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// prendre par id
router.get('/:id', async (req, res) => {
    try {
    //    const quotes = await mongoose.connection.db.collection("v_quote_libcomplet").findOne({ _id: new ObjectId(req.params.id) });
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
        const quote = await updateQuoteState(req.params.id, 3);
        const state = await getAppointmentStateByValue(2);
        await Appointment.findByIdAndUpdate(
            quote.appointment_id,
            { state_appointment_id: state._id },
            { new: true, runValidators: true }
        );
        res.status(201).json(quote);
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

// annuler un devis
router.put('/cancel/:id', async (req, res) => {
    try {
        const quotes = await updateQuoteState(req.params.id, 4);
        await sendEmail (req.body.email, "Annulation de Devis", "Nous vous informons que votre devis a été annulé", res);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// ajouter une remise
router.put('/discount/:id', async (req, res) => {
    try {
        const UpdatedQuote = await addDiscount(req.params.id, req.body.discount);
        res.status(201).json(UpdatedQuote);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Error during updating the discount :' + error.message});
    }
});

module.exports = router;