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
  const [hoveredProducts, setHoveredProducts] = useState([]); // Lưu sản phẩm khi hover

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
  
  // Thêm hàm xử lý hover cho sản phẩm
  const fetchPreviewProducts = async (subcategoryName) => {
    try {
      const res = await getProductBySubcategory(subcategoryName);
      if (res && res.length > 0) {
        setHoveredProducts(res.slice(0, 3)); // Lấy 2-3 sản phẩm đầu tiên
      } else {
        setHoveredProducts([]);
      }
    } catch (error) {
      setHoveredProducts([]);
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
      backgroundColor: "#fdfff8",
    }}
  >
    <Menu.Item key="all" style={{ fontWeight: "bold",  backgroundColor: "#fdfff8", }} 
      onClick={fetchProducts}>
      Tất cả sản phẩm
    </Menu.Item>
    {categories.map((category) => (
      <Menu.SubMenu
        key={category.categoryId}
        style={{ margin: "5px 0", backgroundColor: "#fdfff8", }}
        title={
          <span  onClick={() => fetchGetDetailProduct(category.categoryId)}>
            {category.categoryName}
          </span>
        }
      >
        {category.subcategories &&
          category.subcategories.map((subcategory) => 
            // Thêm key cho từng subcategory
            <Menu.SubMenu
              key={subcategory.subcategoryName}
              style={{fontSize: "14px", margin: "5px 0", width: 300,
                      maxHeight: 500, overflowY: "auto",  backgroundColor: "#fdfff8",}}
              title={
                <span onClick={() => fetchGetDetailSubcategoryName(subcategory.subcategoryName)} >
                  {subcategory.subcategoryName}
                </span>
              }
              // Thêm sự kiện hover cho subcategory
              onTitleMouseEnter={() => {
                setHoveredSubcategory(subcategory.subcategoryName);
                fetchPreviewProducts(subcategory.subcategoryName);
              }}
              // Thêm sự kiện mouse leave cho subcategory
              onTitleMouseLeave={() => {
                setHoveredSubcategory(null);
                setHoveredProducts([]);
              }}
            >
              <Menu.Item
                style={{
                  padding: "8px 20px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  backgroundColor: "#fdfff8",
                }}
                onClick={() => fetchGetDetailSubcategoryName(subcategory.subcategoryName)}
              >
                Xem tất cả {subcategory.subcategoryName}
              </Menu.Item>

              {/* Hiển thị sản phẩm khi hover */}
              {hoveredSubcategory === subcategory.subcategoryName &&
                hoveredProducts.map((product) => (
                  <Menu.Item
                    key={product.id}
                    style={{ padding: "8px 20px", display: "flex",  backgroundColor: "#fdfff8", }}
                  >
                    <div style={{ width: 400 ,display: "flex" ,flex: 2, fontSize: "14px", margin: " 5px 0", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ 
                          fontSize: "14px", 
                          whiteSpace: "normal", // Cho phép chữ xuống dòng
                          wordWrap: "break-word", // Tự động xuống dòng khi quá dài
                          maxWidth: "250px" // Giới hạn chiều rộng để chữ xuống dòng
                        }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: "14px", color: "#888" }}>{product.price} VND</div>
                      </div>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: 50, height: 50, marginLeft: 100, borderRadius: 5,  flexShrink: 0 }}
                      />
                    </div>
                    
                  </Menu.Item>
                ))}
            </Menu.SubMenu>
          )}
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
