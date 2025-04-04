const express = require('express');
const authService = require('../services/authService');
const { User, Profile } = require('../models/User');
const { default: mongoose } = require('mongoose');
var bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.authenticate(email, password);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/client/sign-up', async (req, res) => {
    try {
        const { name, first_name, email, password, contact } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            first_name,
            email,
            "password" : hashedPassword,
            contact,
            "profile_id" : new mongoose.Types.ObjectId("64c8a01f12d4f0f1e99c1a02")
        });

        await user.save();

        const token = await authService.authenticate(email, password);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/profile', (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;