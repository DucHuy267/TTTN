const express = require('express');
const Order = require('../models/orderModel');
const router = express.Router(); // Dùng Router thay vì app

// API lấy thống kê doanh thu theo tháng
router.get('/order-statistics', async (req, res) => {
  try {
    // Lấy tổng doanh thu theo tháng
    const results = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },  // Nhóm theo tháng
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },  // Sắp xếp theo tháng
    ]);
    // Cấu trúc dữ liệu trả về cho biểu đồ
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    // Dữ liệu trả về cho biểu đồ
    const data = {
      labels: months,
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: months.map((month, index) => {
            const result = results.find((res) => res._id === index + 1);
            return result ? result.totalRevenue : 0;
          }),
          backgroundColor: "#4e73df",
        },
      ],
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router; // Xuất router, không phải app
