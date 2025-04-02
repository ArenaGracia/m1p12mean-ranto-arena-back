const express = require('express');
const router = express.Router();

const { getAppointmentsForCalendar } = require('../services/appointmentService');

router.get('/calendar', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const appointments = await getAppointmentsForCalendar(startDate, endDate);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;