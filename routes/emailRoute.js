const express = require('express');
const router = express.Router();

const  { sendEmail, getEmailExcuseTemplate } = require('../services/emailService');
const { formateDate } = require('../utils/dateFormat');
const { updateQuoteState, validateNewDate } = require('../services/quoteService');

// envoyer un email pour nouvelle date de rendez-vous
router.post('/confirmation-new-date', async (req, res) => {
    try {
        const recipient = req.body.email;
        const newDate = formateDate(req.body.newDate);
        const oldDate = formateDate(req.body.oldDate);
        const validatelink = process.env.API_URL + 'api/email/quote/validate-date-by-mail/' + req.body.idQuote + '/' + req.body.newDate;
        const cancellink = process.env.API_URL + 'api/email/quote/decline-by-mail/' + req.body.idQuote;
        console.log("envoi email: " + recipient + " new Date: " + req.body.newDate + " old Date: " + oldDate + " idQuote: " + req.body.idQuote);
        const emailContent = getEmailExcuseTemplate(newDate, oldDate, validatelink, cancellink);
        await sendEmail (recipient, 'Confirmation Nouvelle date de rendez-vous', emailContent, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email" + error.message });
    }
});


// valider devis + nouvelle date via email
router.get('/quote/validate-date-by-mail/:id/:date', async (req, res) => {
    try {
        await validateNewDate(req.params.id, req.params.date);
        res.status(201).json("Votre rendez-vous a été validé avec la nouvelle date");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// rejeter un devis via email
router.get('/quote/decline-by-mail/:id', async (req, res) => {
    try {
        await updateQuoteState(req.params.id, 4);
        res.status(201).json("Votre rendez-vous a été annulé");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


module.exports = router;