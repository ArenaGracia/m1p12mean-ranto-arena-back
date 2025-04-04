const { default: mongoose } = require("mongoose");
const Car = require("../models/Car");
const { ObjectId } = require("mongoose").Types;
const { PrestationBrand } = require('../models/Prestation');

async function getBrand() {
    const brand = await Car.Brand.find();
    console.log(brand);
    
    return brand;
}

async function getBrandWithoutImage() {
    const brand = await Car.Brand.find().select('-image');
    return brand;
}

async function createBrands(brandList, prestationId) {
    const brands = brandList.map(brand => ({
        brand_id: brand._id,
        prestation_id: prestationId,
        duration: brand.duration,
        price: brand.price
    }));

    try {
        const result = await PrestationBrand.insertMany(brands);
        console.log('Brands inserted:', result);
    } catch (error) {
        console.error('Error inserting brands:', error);
    }
}

module.exports = {
    getBrand,
    getBrandWithoutImage,
    createBrands
}