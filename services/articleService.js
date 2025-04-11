const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { Article } = require('../models/Article');
const { prepareImageToInsert } = require("../utils/imageUtils");


async function getArticleWithImage(limit, skip) {
    const collection = mongoose.connection.db.collection("v_article_libcomplet");
    const totalRecords = await collection.countDocuments();
    const articles = await collection.find().skip(skip).limit(limit).toArray();
    const articlesWithImages = articles.map(p => {
        let imageBase64 = null;
        if (p.image) {
            imageBase64 = `data:image/jpeg;base64,${p.image.toString('base64')}`;
        }
        return { ...p, image: imageBase64, };
    });
    return {articles: articlesWithImages, totalRecords};
}

async function createArticle (article) {
    const { name, price, image, category_article } = article;
    imagePrepared = prepareImageToInsert(image);
    const newArticle = new Article({
        name,
        image: imagePrepared,
        price,
        category_article_id: category_article._id
    });
    return await newArticle.save();
}

async function updateArticle (id, data) {
    data.image = prepareImageToInsert(data.image);
    data.category_article_id = new ObjectId(data.category_article._id);
    const updated = await Article.findByIdAndUpdate(id, data, {
        new: true, 
        runValidators: true,
    });
    if (!updated) {
        throw new Error('Article non trouvé');
    }
    return updated;
};


module.exports = {
    getArticleWithImage,
    createArticle,
    updateArticle
}