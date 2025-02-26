import React, { useState, useEffect } from "react";
import { Menu, message, Dropdown } from "antd";
import { getAllProductTrue, getProductByCate } from "../../services/ProductServices";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../../services/CategorySevices";
import { TextHeader } from "./style";
import { DownOutlined } from "@ant-design/icons";

const CategoryDropdown = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      }
    } catch (error) {
      message.error("Failed to load product details. Please try again.");
    }
  };

  // Render menu
  const renderMenu = (
    <Menu
      style={{
        width: 300,
        maxHeight: 500,
        overflowY: "auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "10px 0",
      }}
    >
      <Menu.Item
        key="all"
        style={{ fontWeight: "bold"}}
        onClick={fetchProducts}
      >
        Tất cả sản phẩm
      </Menu.Item>
      {categories.map((category) => (
        <Menu.SubMenu
          key={category.categoryId}
          title=
            <span>
              {category.categoryName}
            </span>
            onClick={() => fetchGetDetailProduct(category.categoryId)}
        >
          {category.subcategories &&
            category.subcategories.map((subcategory) => (
              <Menu.Item
                key={subcategory.subcategoryId}
                style={{
                  padding: "8px 20px",
                  color: "#555",
                  fontSize: "14px",
                }}
                onClick={() => fetchGetDetailProduct(subcategory.subcategoryId)}
              >
                {subcategory.subcategoryName}
              </Menu.Item>
            ))}
        </Menu.SubMenu>
      ))}
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={renderMenu} trigger={["click"]}>
        <TextHeader>
          DANH MỤC
        </TextHeader>
      </Dropdown>
    </div>
  );
};

export default CategoryDropdown;
