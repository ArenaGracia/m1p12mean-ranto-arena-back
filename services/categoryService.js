const { Category } = require("../models/Prestation");
const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongoose").Types;

async function getCategories() {
    const categories = await Category.find();
    return categories;
}

async function getCategoryById(id) {
    const category = await mongoose.connection.db
        .collection("v_category_libcomplet")
        .findOne({ _id: new ObjectId(id) });
    return category ;
}

module.exports = {
    getCategories,
    getCategoryById
}