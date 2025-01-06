const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryId: { type: String, required: true, unique: true, },
    categoryName: { type: String, required: true, },
    image: { type: String, required: false, },
    subcategories: [
        {
            subcategoryId: { type: String, required: true },
            subcategoryName: { type: String, required: true },
        }
    ], // Mảng chứa danh mục con
});

module.exports = mongoose.model('categories', categorySchema);
