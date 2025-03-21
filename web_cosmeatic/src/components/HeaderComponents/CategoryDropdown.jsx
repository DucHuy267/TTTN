import React, { useState, useEffect } from "react";
import { Menu, message, Dropdown } from "antd";
import { getAllProductTrue, getProductByCate, getProductBySubcategory } from "../../services/ProductServices";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../../services/CategoryServices"; 
import { TextHeader } from "./style";

const CategoryDropdown = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);

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

  const fetchGetDetailSubcategoryName = async (subcategoryName) => {
    try {
      const res = await getProductBySubcategory(subcategoryName);
      if (res) {
        navigate("/products", { state: { products: res } });
      }
    } catch (error) {
      message.error("Failed to load product details. Please try again.");
    }
  };

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
      <Menu.Item key="all" style={{ fontWeight: "bold" }} onClick={fetchProducts}>
        Tất cả sản phẩm
      </Menu.Item>
      {categories.map((category) => (
        <Menu.SubMenu
          key={category.categoryId}
          title={<span onClick={() => fetchGetDetailProduct(category.categoryId)}>{category.categoryName}</span>}
        >
          {category.subcategories &&
            category.subcategories.map((subcategory) => (
              <Menu.SubMenu
                key={subcategory.subcategoryName}
                title={subcategory.subcategoryName}
                onTitleMouseEnter={() => setHoveredSubcategory(subcategory.subcategoryName)}
                onTitleMouseLeave={() => setHoveredSubcategory(null)}
              >
                <Menu.Item
                  style={{
                    padding: "8px 20px",
                    color: "#555",
                    fontSize: "14px",
                  }}
                  onClick={() => fetchGetDetailSubcategoryName(subcategory.subcategoryName)}
                >
                  Xem tất cả {subcategory.subcategoryName}
                </Menu.Item>

                {/* Menu con hiển thị khi hover */}
                {hoveredSubcategory === subcategory.subcategoryName && (
                  <>
                    <Menu.Item key={`${subcategory.subcategoryName}-related-1`} style={{ padding: "8px 20px", color: "#888" }}>
                      Sản phẩm nổi bật
                    </Menu.Item>
                    <Menu.Item key={`${subcategory.subcategoryName}-related-2`} style={{ padding: "8px 20px", color: "#888" }}>
                      Sản phẩm giảm giá
                    </Menu.Item>
                  </>
                )}
              </Menu.SubMenu>
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
