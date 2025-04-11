const express = require('express');
const router = express.Router();

const ArticleService = require('../services/articleService');


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const data = await ArticleService.getArticleWithImage(limit, skip);
        res.json(data);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const savedArticle = await ArticleService.createArticle(req.body.article);
        res.status(201).json(savedArticle);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedArticle = await ArticleService.updateArticle(id, updatedData);
        res.json(updatedArticle);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;