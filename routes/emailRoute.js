const express = require('express');
const router = express.Router();


const  { sendEmail, getEmailExcuseTemplate } = require('../services/emailService');
const { formateDate } = require('../utils/dateFormat');

// envoyer un email pour nouvelle date de rendez-vous
router.post('/confirmation-new-date', async (req, res) => {
    try {
        const recipient = req.body.email;
        const newDate = formateDate(req.body.newDate);
        const oldDate = formateDate(req.body.oldDate);
        const validatelink = 'http://localhost:5000/quotes/validate/newDdate';
        const cancellink = 'http://localhost:5000/quotes/decline';
        console.log("envoi email: " + recipient + " new Date: " + new Date + " old Date: " + new Date);
        const emailContent = getEmailExcuseTemplate(newDate, oldDate, validatelink, cancellink);
        await sendEmail (recipient, 'Confirmation Nouvelle date de rendez-vous', emailContent, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email" + error.message });
    }
});


module.exports = router;