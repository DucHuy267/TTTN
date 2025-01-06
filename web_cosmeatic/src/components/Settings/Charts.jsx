import React, { useEffect, useState } from "react"; 
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import axios from 'axios';  // Import axios để gọi API
import './Charts.css';

// Đăng ký các thành phần biểu đồ
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Charts = () => {
  const [chartData, setChartData] = useState(null);

  // Định nghĩa bảng màu sáng
  const lightColors = [
    "#6c8ef0", // Xanh dương nhạt
    "#8c63f9", // Chàm nhạt
    "#9e69d1", // Tím nhạt
    "#f68ca6", // Hồng nhạt
    "#f1a8a1", // Đỏ nhạt
    "#ff9e5f", // Cam nhạt
    "#f8d86f", // Vàng nhạt
    "#55e1a4", // Xanh lá nhạt
    "#7ee0c5", // Xanh lam nhạt
    "#5fc1d6", // Lam nhạt
    "#f9f9f9", // Trắng nhạt (gần trắng)
    "#b0b7be", // Xám nhạt
    "#9a9ea7", // Xám đậm nhạt
  ];

  useEffect(() => {
    // Lấy dữ liệu biểu đồ từ API
    axios.get('http://localhost:4000/charts/order-statistics')
      .then(response => {
        // Sửa đổi dữ liệu để thêm các màu sáng cho từng tháng
        const data = response.data;
        const months = data.labels;  // Giả sử labels là các tháng

        // Áp dụng bảng màu sáng cho dữ liệu của các biểu đồ Pie, Line và Bar
        setChartData({
          ...data,
          datasets: data.datasets.map((dataset, index) => ({
            ...dataset,
            backgroundColor: lightColors.slice(0, months.length), 
            borderColor: lightColors.slice(0, months.length),    
            borderWidth: 1,          
          })),
        });
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      });
  }, []);  // Chỉ chạy khi component được mount

  // Trả về thông báo loading nếu dữ liệu chưa có
  if (!chartData) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="charts-container">
      <h2 style={{ margin: '10px 50px', fontSize: 20, color:'#000', fontWeight:'bold'}} className="charts-title">The Cocoon Original</h2>

      <div className="charts">
        {/* Biểu đồ Tròn (bên trái) */}
        <div className="chart-container">
          <h4>Biểu Đồ Tròn</h4>
          <Pie data={chartData} />
        </div>

        {/* Biểu đồ Đường (bên phải) */}
        <div className="chart-container">
          <h4>Biểu Đồ Đường</h4>
          <Line data={chartData} />
        </div>
      </div>

      {/* Biểu đồ Cột (chiếm toàn bộ chiều rộng dưới các biểu đồ Pie & Line) */}
      <div className="bar-chart-container">
        <h4>Biểu Đồ Cột</h4>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Charts;
