const express = require('express');
const router = express.Router();

const { getAppointmentsForCalendar, endAppointment } = require('../services/appointmentService');
const { PrestationBrand } = require('../models/Prestation');
const { Quote, QuoteDetails } = require('../models/Quote');
const { Appointment } = require('../models/Appointment');
const { default: mongoose } = require('mongoose');

router.get('/calendar', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const appointments = await getAppointmentsForCalendar(startDate, endDate);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/end', async (req, res) => {
    try {
        const appointment = await endAppointment(req.body.appointmentId, req.body.quoteId, req.body.appointmentLeft);
        res.json(appointment);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { appointment, prestationsChoisis } = req.body;
        const now = new Date();

        if (new Date(appointment.time_start) <= now) {
            throw new Error("La date du rendez-vous doit être dans le futur.");
        }

        if (!appointment?.car?._id || !appointment?.time_start) {
            throw new Error("Champs manquants dans la requête : car._id ou time_start");
        }

        let totalPrice = 0;

        const appointment1 = new Appointment({
            user_id: req.user["id"],
            car_id: appointment.car._id,
            time_start: appointment.time_start,
            time_end : null,
            state_appointment_id: new mongoose.Types.ObjectId("67e413d2753a66d8a6bc9b3b")
        });

        await appointment1.save({ session });

        const quote = new Quote({
            appointment_id: appointment1._id,
            total_price: 0,
            discount: 0,
            quote_state_id: new mongoose.Types.ObjectId("67e40d3e753a66d8a6bc9b37")
        });

        await quote.save({ session });

        for (const prestationId of prestationsChoisis) {
            const prestation = await PrestationBrand.findOne({ 
                                        prestation_id : new  mongoose.Types.ObjectId(prestationId) , 
                                        brand_id : new mongoose.Types.ObjectId(appointment.car.brand._id) });

            if (!prestation) {
                throw new Error('Prestation introuvable');
            }     

            console.log(prestation);
            

            const detail = new QuoteDetails({
                prestation_brand_id: prestation,
                quote_id: quote._id,
                price: new mongoose.mongo.Double(prestation.price)
            });
            
            await detail.save({ session });
            totalPrice += prestation.price;
        }

        quote.total_price = totalPrice;
        await quote.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: 'Rendez-vous et devis créés avec succès',
            appointment,
            quote
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Erreur lors de la création avec transaction :', error);
        res.status(500).json(error.message);
    }
});

module.exports = router;