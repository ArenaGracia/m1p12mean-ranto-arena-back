const express = require('express');
const router = express.Router();
const { CategoryArticle } = require('../models/Article');

router.get('/', async (req, res) => {
    try {
        const categories = await CategoryArticle.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;