const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId} = mongoose.Types;
const {createTasks, getTasks, getNonAffectedTasks} = require('../services/TaskService');
const { Task } = require('../models/Task');

router.get("/", async (req, res) => {
    const { page, size, state, userId, startDate, endDate, categoryId } = req.query;
    const states = await getTasks(page, size, state, userId, startDate, endDate, categoryId);
    res.status(201).json(states);
});

// taches non affectées
router.get("/non-affected", async (req, res) => {
    const { page, size } = req.query;
    const states = await getNonAffectedTasks(page, size);
    res.status(201).json(states);
});

router.get("/:state", async (req, res) => {
    const states = await Task.find({state: req.params.state});
    return status(201).json(states);
});

// Créer les tâches à partir d'un devis
router.get("/create/:idQuote", async (req, res) => {
    try {
        await createTasks(req.params.idQuote);
        res.status(201).json({message: "Tâches créées avec succès"});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message});
    }
});

router.put('/affect', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.body.taskId,
            { "user_id": new ObjectId(req.body.userId) },
            { new: true, runValidators: true }
        );
        res.status(201).json(updatedTask);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


module.exports = router;
