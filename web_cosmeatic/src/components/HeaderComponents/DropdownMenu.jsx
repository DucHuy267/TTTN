import React, { useState } from "react";
import"./DropdownMenu.css";

const menuData = [
  {
    title: "Sức Khỏe - Làm Đẹp",
    subcategories: [],
  },
  {
    title: "Chăm Sóc Da Mặt",
    subcategories: [
      {
        title: "Làm Sạch Da",
        items: ["Tẩy Trang Mặt", "Sữa Rửa Mặt", "Tẩy Tế Bào Chết Da Mặt", "Toner / Nước Cân Bằng Da"],
      },
      {
        title: "Đặc Trị",
        items: ["Serum / Tinh Chất", "Hỗ Trợ Trị Mụn"],
      },
      {
        title: "Dưỡng Ẩm",
        items: ["Xịt Khoáng", "Lotion / Sữa Dưỡng", "Kem / Gel / Dầu Dưỡng"],
      },
      // Thêm các danh mục con khác...
    ],
  },
  {
    title: "Trang Điểm",
    subcategories: [],
  },
  // Thêm các danh mục chính khác...
];

const DropdownMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleMouseEnter = (index) => {
    setActiveCategory(index);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  return (
    <div className="dropdown-menu">
      <ul className="menu-list">
        {menuData.map((category, index) => (
          <li
            key={index}
            className="menu-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {category.title}
            {category.subcategories.length > 0 && (
              <div className="submenu">
                {category.subcategories.map((sub, subIndex) => (
                  <div key={subIndex} className="submenu-category">
                    <h4>{sub.title}</h4>
                    <ul>
                      {sub.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
