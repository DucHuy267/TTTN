import React, { useEffect, useState } from "react";
import axios from "axios";
import HomePageHeader from "../../components/HeaderComponents/HomePageHeader";

const API_URL = "http://localhost:4000/brands/getAll"; // Đường dẫn API lấy danh sách brands

const Brand = () => {
  const [brands, setBrands] = useState([]); // State để lưu danh sách thương hiệu
  const [loading, setLoading] = useState(true); // State hiển thị loading khi fetch data

  // Hàm gọi API lấy danh sách thương hiệu
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          setBrands(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchBrands();
  }, []); // Gọi API khi component được render lần đầu

  // Hiển thị loading khi đang fetch data
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div>
     
      <div style={{ gap: "30px", padding: "40px" }}>
        {brands.map((brand, index) => (
          <div
            key={brand._id} 
            style={{
              display: "flex",
              flexDirection: index % 2 === 0 ? "row" : "row-reverse", // Đổi vị trí ảnh và nội dung
              borderRadius: "12px",
              overflow: "hidden",
              marginTop: "20px",
            }}
          >
            <div style={{ width: "50%", padding: "30px" }}>
              <img
                src={brand.image} 
                alt={brand.name}
                style={{
                  width: "700px",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </div>

            <div style={{ padding: "30px", width: "50%" }}>
              <h2 style={{ fontSize: "50px", color: "#2f855a", marginBottom: "10px" }}>
                {brand.name}
              </h2>
              <p style={{ color: "#4a5568", marginBottom: "20px", fontSize: "20px" }}>
                {brand.description}
              </p>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#357D18",
                  marginTop: "100px",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              >
                See More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
