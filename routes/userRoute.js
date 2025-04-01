const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/:profileName', async (req, res) => {
    try {
        const users = await mongoose.connection.db
            .collection("v_user")
            .find({ "profile.name" : req.params.profileName }).toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
