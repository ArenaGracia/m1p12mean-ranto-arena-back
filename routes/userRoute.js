const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getMecanicienPerformancePerTask } = require('../services/userService');

router.get('/list/:profileName', async (req, res) => {
    try {
        const users = await mongoose.connection.db
            .collection("v_user")
            .find({ "profile.name" : req.params.profileName }).toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/performances', async (req, res) => {
    try {
        const performances = await getMecanicienPerformancePerTask();
        res.status(200).json(performances);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
