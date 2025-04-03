const express = require('express');
const router = express.Router();

const { getAppointmentsForCalendar, endAppointment } = require('../services/appointmentService');

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

module.exports = router;