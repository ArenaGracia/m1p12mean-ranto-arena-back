const { default: mongoose } = require("mongoose");
const Car = require("../models/Car");
const { ObjectId } = require("mongoose").Types;

async function getBrand() {
    const brand = await Car.Brand.find();
    console.log(brand);
    
    return brand;
}

module.exports = {
    getBrand
}