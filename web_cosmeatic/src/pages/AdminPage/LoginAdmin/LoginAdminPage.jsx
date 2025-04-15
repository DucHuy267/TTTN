import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, message } from "antd";
import { loginAdmin } from "../../../services/UserSevices";
import "./LoginPageStyles.css";
import Video from "./video/video.mp4";
import { jwtDecode } from "jwt-decode";

function LoginAdminPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(data);
      const tokenAdmin = res.token;
      const decoded = jwtDecode(tokenAdmin);

      if (decoded.role !== 'admin') {
        message.error("Không có quyền truy cập admin");
        return;
      }

      localStorage.setItem("tokenAdmin", tokenAdmin);
      message.success("Đăng nhập thành công");
      navigate("/admin");
    } catch (err) {
      message.error(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.role === "admin") {
        localStorage.setItem("token", token);
        navigate("/admin");
      } else {
        message.error("Token không hợp lệ cho admin");
      }
    }
  }, [navigate]);


  return (
    <div className="containers">
      <div className="container">
        {/* Left Section */}
        <div className="left">
          <video className="background-video" src={Video} autoPlay loop muted />
          <div className="text-overlay">
            <div className="headline">
              <span className="line1">Tạo và bán</span>
              <span className="line2"> Sản phẩm</span>
              <span className="line3">Chất lượng</span>
            </div>
            <p>Vẻ đẹp an lành từ thiên nhiên</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="right">
        <h2 style={{ fontWeight: 'bold' }}>Chào mừng trở lại!</h2>
          <form onSubmit={handleLogin} style={{ width: "80%" }}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={data.email}
                onChange={handleChange}
                required
                style={{ height: "40px" }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <Input.Password
                type="password"
                id="password"
                placeholder="Enter Password"
                value={data.password}
                onChange={handleChange}
                required
                style={{ height: "40px" }}
              />
            </div>
            <button type="submit" className="btn">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginAdminPage;
