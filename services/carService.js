const { default: mongoose } = require("mongoose");
const Car = require("../models/Car");
const { ObjectId } = require("mongoose").Types;

async function getCar() {
    const car = await Car.find();
    return car;
}

async function getCarByUser(id) {
    const cars = await mongoose.connection.db
        .collection("v_car_brand")
        .find({ user_id: new ObjectId(id) })
        .toArray();
    console.log(cars);
    
    return cars ;
}

module.exports = {
    getCar,
    getCarByUser
}