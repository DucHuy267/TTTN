import React, { useEffect, useState } from "react";
import axios from "axios";
import HomePageHeader from "../../components/HeaderComponents/HomePageHeader";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000/brands/getAll";

const Brand = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "24px" }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: "#FDFFF8", padding: "60px 5%" }}>
      {brands.map((brand, index) => (
        <div
          key={brand._id}
          style={{
            display: "flex",
            flexDirection: index % 2 === 0 ? "row" : "row-reverse",
            alignItems: "center",
            gap: "50px",
            marginBottom: "100px",
          }}
        >
          <div style={{ flex: 1 }}>
            <img
              src={brand.image}
              alt={brand.name}
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "42px",
                color: "#357D18",
                marginBottom: "20px",
                fontFamily: "'Abhaya Libre', serif",
                fontWeight: 800,
              }}
            >
              {brand.name}
            </h2>
            <p style={{ color: "#4a5568", fontSize: "18px", lineHeight: "1.6", marginBottom: "30px" }}>
              {brand.description}
            </p>
            <button
              onClick={() => navigate(`/brands/${brand._id}`)}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2f855a")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#38a169")}
            >
              Xem thêm →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Brand;
