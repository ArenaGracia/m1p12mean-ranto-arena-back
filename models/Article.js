const mongoose = require('mongoose');
const SchemaTypes = mongoose.Schema.Types;

const CategoryArticleSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
}, { collection: 'category_article' });

const ArticleSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    image: { type: Buffer, required: true },
    price: {type: SchemaTypes.Double, required: true},    
    category_article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category_article", required: true } 
}, { collection: 'article' });

module.exports = {
    CategoryArticle: mongoose.model("CategoryArticle", CategoryArticleSchema),
    Article: mongoose.model('Article', ArticleSchema),
};
