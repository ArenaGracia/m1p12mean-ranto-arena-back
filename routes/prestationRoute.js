const express = require('express');
const router = express.Router();

const { Category, Prestation } = require("../models/Prestation");
const { getPrestationWithImage, getPrestationById } = require("../services/prestationService");

router.get('/', async (req, res) => {
    try {
        const prestations = await getPrestationWithImage();
        res.json(prestations);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const prestation = await getPrestationById(req.params.id);
        res.status(200).json(prestation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description, image, category } = req.body;

        const newPrestation = new Prestation({
            name,
            description,
            image,
            category
        });

        const savedPrestation = await newPrestation.save();
        res.status(201).json(savedPrestation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedPrestation = await updatePrestation(res.params.id, res.body);

        res.status(200).json(updatedPrestation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedPrestation = await Prestation.findByIdAndDelete(req.params.id);

        if (!deletedPrestation) {
            return res.status(404).json({ message: 'Prestation non trouvée.' });
        }

        res.status(200).json({ message: 'Prestation supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;