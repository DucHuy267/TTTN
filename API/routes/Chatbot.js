const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

// 🔎 Chatbot tìm sản phẩm
router.get("/chat", async (req, res) => {
    const userMessage = req.body.message.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, "").trim();
  
    if (userMessage.includes("tìm") || userMessage.includes("có không")) {
        const productName = userMessage.replace(/(tìm|có không|shop có|sản phẩm này|không|\?|!)/gi, "").trim();
        console.log("Đang tìm sản phẩm:", productName);
        if (!productName) return res.json({ reply: "❌ Vui lòng nhập tên sản phẩm." });
  
      const products = await Product.find({ name: { $regex: productName, $options: "i" } });
      console.log("Kết quả tìm kiếm:", products);
      if (products.length > 0) {
        const response = products.map((p) => `📌 ${p.name} - Giá: ${p.price.toLocaleString("vi-VN")}đ`).join("\n");
        return res.json({ reply: `🔍 Shop có các sản phẩm:\n${response}` });
      }
  
      return res.json({ reply: "❌ Xin lỗi, shop không tìm thấy sản phẩm này." });
    }
  
    res.json({ reply: "❓ Tôi không hiểu yêu cầu của bạn." });
  });  

// 🛒 Thêm sản phẩm vào giỏ hàng
router.post("/cart/add", async (req, res) => {
    const { userId, productName } = req.body;
    if (!userId) return res.json({ reply: "❌ Lỗi: Không tìm thấy người dùng." });
  
    const product = await Product.findOne({ name: { $regex: productName, $options: "i" } });
    if (!product) return res.json({ reply: "❌ Sản phẩm không tồn tại." });
  
    let cart = await Cart.findOne({ _id: userId });
    if (!cart) cart = new Cart({ _id: userId, products: [] });
  
    const existingProduct = cart.products.find((p) => p.productId.equals(product._id));
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ productId: product._id, quantity: 1 });
    }
  
    await cart.save();
    res.json({ reply: `🛒 Đã thêm **${product.name}** vào giỏ hàng!` });
  });
  
module.exports = router;
