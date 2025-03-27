const Prestation = require("../models/Prestation");
const { Category } = require("../models/Prestation");
const { getPrestationByCategory } = require("./prestationService");

async function getCategories() {
    const categories = await Category.find();
    return categories;
}

async function getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
        throw new Exception ('Category non trouvée.');
    }
    const prestations = await getPrestationByCategory(id);
    return { category, prestations };
}

module.exports = {
    getCategories,
    getCategoryById
}