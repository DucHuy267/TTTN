import React, { useEffect, useState } from "react";
import { Col, Input, Popover, message, Badge, notification, Modal, ConfigProvider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/UserSevices"; // Sửa tên service
import { searchProduct } from "../../services/ProductServices";
import { TextHeader, WrapperHeader, AccoutHeader, ContentPopup, Span, } from "./style";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CategoryDropdown from "./CategoryDropdown";
import LoginPage from "../Login-SignUp/LoginPage"; // Import LoginPage component
import { FaShoppingCart } from "react-icons/fa";

const { Search } = Input;

const HomePageHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility

  // Fetch user information
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        fetchUsername(decoded.userId);
        fetchCart(decoded.userId);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const fetchUsername = async (userId) => {
    try {
      const user = await getUserById(userId);
      if (user) {
        setUsername(user.name);
      }
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  const handleSearch = async (value) => {
    if (!value) {
      message.error('Vui lòng nhập tên sản phẩm để tìm kiếm');
      return;
    }
    try {
      const res = await searchProduct(value);
      if (res) {
        navigate("/products", { state: { products: res } });
      } else {
        message.error(res.message || 'No products found');
      }
    } catch (error) {
      message.error('Lỗi tìm kiếm sản phẩm');
    }
  };

  // lấy số lượng sp trong giỏ
  const fetchCart = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:4000/carts/${userId}`);
        if (response.status === 200) {
            const products = response.data?.products || [];
            const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity
            // Set the total quantity into the state or use it as needed
            setCartQuantity(totalQuantity); // Assuming you're using React's useState for the count
        }
    } catch (error) {
        console.error(error);
    }
};

// bán chạy
const fetchProducts = async () => {
  try {
      const res = await axios.get(`http://localhost:4000/dmf/hot-selling-products`);
      if (res.data) {
          // Lấy đánh giá cho từng sản phẩm
          const productsWithRatings = await Promise.all(
              res.data.map(async (product) => {
                  try {
                      const rating = await fetchRating(product._id);
                      return { ...product, rating };
                  } catch (error) {
                      console.error(`Lỗi khi lấy đánh giá sản phẩm ${product.product._id}:`, error);
                      return { ...product, rating: 0 }; // Nếu lỗi, đặt rating = 0
                  }
              })
          );

          // Điều hướng với dữ liệu đã xử lý
          navigate("/hotselling", { state: { products: productsWithRatings } });
          console.log("Sản phẩm bán chạy:", productsWithRatings);
      }
  } catch (error) {
      message.error("Không thể tải danh sách sản phẩm.");
      console.error("Lỗi khi tải sản phẩm:", error);
  }
};

const fetchRating = async (productId) => {
  try {
      const response = await axios.get(`http://localhost:4000/comments/getCommentsByProductId/${productId}`);
      const comments = response.data.data.comments || [];

      return comments.length > 0 
          ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
          : 0;
  } catch (error) {
      console.error(`Lỗi khi lấy đánh giá sản phẩm ${productId}:`, error);
      return 0;
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUsername("");
    navigate("/");
  };

  const handleNavigateLogin = () => {
    if (token) {
      navigate("/profile");
    } else {
      setIsModalVisible(true); // Show the modal
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Hide the modal
  };

  const content = (
    <div>
      <ContentPopup onClick={handleLogout}>Đăng xuất</ContentPopup>
      <ContentPopup onClick={() => navigate("/profile")}>Thông tin người dùng</ContentPopup>
    </div>
  );

  // Kiểm tra nếu hiện tại là trang cart
  const isCartPage = location.pathname === "/cart";

  return (
    <div style={{ backgroundColor: "#fdfff8", borderBottom: "2px solid  #357D18" }}>
      <div>
          <WrapperHeader>
            <Col span={5} style={{ padding: "18px 0px" }}> 
              {/* <img
                width={50}
                height={50}
                src={logo}
                alt="Logo"
              /> */}
              <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#357D18', margin:'0px', fontFamily:'-moz-initial' }}>
                Adora
              </h2>
            </Col>
            <Col span={15} style={{ padding: "18px 0px" }}>
            <Search 
              placeholder="Search" 
              allowClear 
              style={{ padding: "0px 50px", width: '65%', borderRadius: '10px' }} 
              onSearch={handleSearch} 
            />
            </Col>
            <Col span={1} style={{ padding: "22px 0px" }}>
            {!isCartPage && (
            <div onClick={() => navigate("/cart")}>
              <Badge count={cartQuantity}  size="small" >
                {/* <img
                  width={20}
                  src="https://cdn.icon-icons.com/icons2/494/PNG/512/cart_icon-icons.com_48341.png"
                  alt="Cart"
                /> */}
                <FaShoppingCart style={{fontSize: 25}} />
              </Badge>
            </div>
          )}
            </Col>
            <Col span={3} style={{ padding: "18px 0px" }}>
              <AccoutHeader>
                <div>
                  <img
                    width={20}
                    src="https://cdn1.iconfinder.com/data/icons/web-essentials-6/24/user-128.png"
                    alt="User"
                  />
                </div>
                {token ? (
                  <Popover placement="bottom" content={content} trigger="click">
                    <Span>Chào, {username}</Span>
                  </Popover>
                ) : (
                  <div onClick={handleNavigateLogin}>
                    <Span>Đăng nhập</Span>
                  </div>
                )}
              </AccoutHeader>
            </Col>
          </WrapperHeader>
      </div>
      <div style={{ display: "flex", marginTop: 8, marginLeft: 100, marginBottom: 15 }}>
            <div style={{ display: "flex" }}>
              <TextHeader style={{ marginLeft: 5, fontWeight: "bold"  }}>
                <CategoryDropdown/>
                {/* Danh mục */}
              </TextHeader>
            </div>
            <div>
              <TextHeader style={{ marginLeft: 50, fontWeight: "bold" }} onClick={() => navigate("/brands")}>
                THƯƠNG HIỆU
              </TextHeader>
            </div>
            <div>
              <TextHeader style={{ marginLeft: 50 , fontWeight: "bold" }} onClick={fetchProducts}>
                BÁN CHẠY 
              </TextHeader>
            </div>
            {/* <div>
              <TextHeader style={{ marginLeft: 50 , fontWeight: "bold" }} onClick={() => navigate("")}>
                HOT DEALS 
              </TextHeader>
            </div> */}
      </div>

      

      <ConfigProvider theme={theme}>
      <Modal
       title="Đăng nhập" visible={isModalVisible} onCancel={handleModalCancel} footer={null}
        style={{ top: 30 }}
       >
        <LoginPage onClose={handleModalCancel} />
      </Modal>
    </ConfigProvider>
    </div>
  );
};

const theme = {
  components: {
    Modal: {
      contentBg: "#fdfff8", // Thay đổi màu nền
      headerBg: "#fdfff8", // Màu header
      colorText: "#333", // Màu chữ
    },
  },
};

export default HomePageHeader;