const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  categoryId: { type: String }, 
  subcategoryId: { type: String }, // Tham chiếu danh mục con
  brand: { type: String }, // Thêm trường brand
  imageUrls: [{ type: String }], // Thay đổi trường imageUrl để lưu trữ mảng các URL hình ảnh
  isVisible: { type: Boolean, default: true },
  specifications: { type: Object }, // Thêm trường thông số kỹ thuật
  tags: [{ type: String }], // Thêm trường tags dưới dạng mảng chuỗi
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
