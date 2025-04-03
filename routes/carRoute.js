const express = require('express');
const router = express.Router();

const { getCarByUser } = require('../services/carService');
const { Car } = require('../models/Car');
const { default: mongoose } = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const userId = req.user["id"];
        console.log("fjbk");
        
        const cars = await getCarByUser(userId);
        res.json(cars);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        

        const { license_plate_number, brand } = req.body;
        

        const newCar = new Car ({
            license_plate_number,
            "brand_id":  new mongoose.Types.ObjectId(brand._id),
            "user_id" :   new mongoose.Types.ObjectId(req.user["id"])
        });

        console.log(newCar);
        

        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;