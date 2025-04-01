const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {createTasks, getTasks} = require('../services/TaskService');

router.get("/", async (req, res) => {
    const { page, size } = req.query;
    const states = await getTasks(page, size);
    res.status(201).json(states);
});

router.get("/:state", async (req, res) => {
    const states = await Task.find({state: req.params.state});
    return status(201).json(states);
});

router.get("/create/:idQuote", async (req, res) => {
    try {
        await createTasks(req.params.idQuote);
        res.status(201).json({message: "Tâches créées avec succès"});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message});
    }
})

module.exports = router;
