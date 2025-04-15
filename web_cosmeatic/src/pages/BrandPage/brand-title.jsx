import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Cocoon.css";

const API_URL = "http://localhost:4000/brands";

const Cocoon = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/getDetailBrand/${id}`);
        if (response.status === 200) {
          setBrand(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thương hiệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandDetails();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "20px" }}>Đang tải...</div>;
  }

  if (!brand) {
    return <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>Không tìm thấy thương hiệu</div>;
  }

  return (
    <div className="brand-container">
          <h1 className="brand-title">
                Câu chuyện thương hiệu <span className="brand-name">{brand.name}</span>
          </h1>

      <div className="brand-story">
        {brand.sections?.map((section, index) => (
          <React.Fragment key={index}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Cocoon;
