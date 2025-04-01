const express = require('express');
const authService = require('../services/authService');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(password);
        
        const token = await authService.authenticate(email, password);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

router.get('/profile', (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;