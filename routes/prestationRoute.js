const express = require('express');
const router = express.Router();

const { Category, Prestation } = require("../models/Prestation");
const { getPrestationWithImage, getPrestationById, updatePrestation, createPrestation } = require("../services/prestationService");
const BrandService = require('../services/brandService');

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
        console.log(`Taille de l'image reçue : ${req.body.prestation.image.length} caractères`);
        const savedPrestation = await createPrestation(req.body.prestation);
        await BrandService.createBrands(req.body.brands, savedPrestation._id);
        res.status(201).json(savedPrestation);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedPrestation = await updatePrestation(req.params.id, req.body);
        res.status(200).json(updatedPrestation);
    } catch (error) {
        console.error(error.message);
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