const Prestation = require("../models/Prestation");
const { Category } = require("../models/Prestation");
const { getPrestationByCategory } = require("./prestationService");

async function getCategories() {
    const categories = await Category.find();
    return categories;
}

async function getCategoryById(id) {
    const prestations = await getPrestationByCategory(id);
    return { prestations };
}

module.exports = {
    getCategories,
    getCategoryById
}