require('dotenv').config();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');


// Configuration du transporteur de mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

exports.sendEmail = async function (to, subject, text, res) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: text
        });

        res.status(200).json({ message: "Email envoyé avec succès à " + to });
    } catch (error) {
        throw error;
    }
};


// envoi d'un email d'excuse

exports.getEmailExcuseTemplate = function (newDate, oldDate, validatelink, cancellink) {
    const filePath = path.join(__dirname, '..', 'templates', 'email.excuse.template');

    try {
        const data = fs.readFileSync(filePath, 'utf8');
            return data
                .replace(/\${newDate}/g, newDate)
                .replace(/\${oldDate}/g, oldDate)
                .replace(/\${validateLink}/g, validatelink)
                .replace(/\${cancelLink}/g, cancellink);
    } catch (error) {
        throw new Error("Erreur lors de l'ouverture du fichier " + error);
    }
}