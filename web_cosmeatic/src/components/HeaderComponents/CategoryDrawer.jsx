import React, { useState, useEffect } from "react";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import { Span, TextHeader } from "./style";
import { getAllProductTrue, getProductByCate } from "../../services/ProductServices";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAllCategory } from "../../services/CategorySevices";

const CategoryDrawer = ({ isOpenDrawer, onClose }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);

  useEffect(() => {
    // Fetch categories when the drawer is opened
    if (isOpenDrawer) {
      fetchCategories();
    }
  }, [isOpenDrawer]);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategory();
      if (res) {
        setCategories(res.map((item) => ({ ...item, key: item.categoryId })));
      }
    } catch (error) {
      message.error("Failed to load categories.");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProductTrue();
      if (res) {
        navigate("/products", { state: { products: res } });
      }
    } catch (error) {
      message.error("Failed to load products.");
    }
  };

  const fetchGetDetailProduct = async (categoryId) => {
    try {
      const res = await getProductByCate(categoryId);
      if (res) {
        navigate("/products", { state: { products: res } });
        onClose();
      }
    } catch (error) {
      message.error("Failed to load product details. Please try again.");
    }
  };

  return (
  <DrawerComponent
    title="Sản Phẩm"
    placement="left"
    isOpen={isOpenDrawer}
    onClose={onClose}
    width="25%"
    style={{ marginTop: 100 }}
  >
    <TextHeader
      onClick={() => {
        fetchProducts(null); // Assuming null fetches all products
        onClose();
      }}
      style={{
        margin: "5px 5px 10px",
        fontSize: 20,
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      Tất cả sản Phẩm
    </TextHeader>
    <div style={{ display: "flex", flexDirection: "row", position: "relative" }}>
      <div style={{ width: "50%" }}>
        {categories.map((category) => (
          <div
            key={category.categoryId}
            style={{
              marginTop: 10,
              cursor: "pointer",
              position: "relative",
              padding: "10px",
              border: "1px solid #f0f0f0",
              borderRadius: "5px",
            }}
            onMouseEnter={() => setHoveredCategoryId(category.categoryId)}
            onMouseLeave={() => setHoveredCategoryId(null)}
          >
            <span
              style={{
                marginTop: 5,
                marginLeft: 5,
                display: "inline-block",
                fontSize: "16px",
                color: "#333",
              }}
            >
              {category.categoryName}
            </span>
          </div>
        ))}
      </div>

      {/* Thanh bên phải */}
      {hoveredCategoryId && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            background: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            width: "50%",
            height: "100%",
            padding: "10px",
            overflowY: "auto",
          }}
        >
          {categories
            .find((category) => category.categoryId === hoveredCategoryId)
            ?.subcategories.map((subcategory, index) => (
              <div
                key={index}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "14px",
                  color: "#555",
                }}
                onClick={() =>
                  console.log(`Subcategory: ${subcategory.subcategoryName}`)
                }
              >
                {subcategory.subcategoryName}
              </div>
            ))}
        </div>
      )}
    </div>
  </DrawerComponent>
);

};

export default CategoryDrawer;
