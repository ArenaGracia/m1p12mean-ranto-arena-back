const express = require('express');
const router = express.Router();

const { getBrand } = require('../services/brandService');

router.get('/', async (req, res) => {
    try {
        const brand = await getBrand();
        res.json(brand);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;