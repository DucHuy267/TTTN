import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, message, Modal } from "antd";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { login } from "../../services/UserSevices";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import SignupPage from "./SignupPage";

function LoginPage({ onClose }) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openSignupModal = () => {
    onClose();
    setIsSignupOpen(true);
  };

  const openLoginModal = () => {
    setIsSignupOpen(false);
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(data);
      localStorage.setItem("token", res.token);
      message.success("Đăng nhập thành công");
      onClose();
      navigate("/");
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

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:4000/auth/facebook";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={{ margin: "40px 20px", justifyContent: "center", alignItems: "center", backgroundColor: "#fdfff8" }}>  
      <p style={{ fontWeight: "bold", fontSize: "25px", fontFamily: "serif", margin: 0 }}>
        Audora chào bạn trở lại
      </p>
      <div style={{ display: "flex" }}>
        <p style={{ padding: "5px 0", color: "#b8b6af" }}>Bạn chưa có tài khoản?</p>
        <Button style={{ color: "#1b5e20", padding: "0 5px" }} type="link" onClick={openSignupModal}>
          Tạo tài khoản mới
        </Button>
      </div>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Input
            type="email"
            id="email"
            placeholder="Nhập email"
            value={data.email}
            onChange={handleChange}
            required
            style={{
              height: "60px",
              fontSize: "20px",
              margin: 0,
              backgroundColor: "#fdfff8",
              border: "none",
              borderBottom: "2px solid #1b5e20",
              borderRadius: "0",
            }}
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.45)", fontSize: "20px" }} />} 
          />
        </div>
        <div style={{ marginTop: "40px" }}>
          <Input.Password
            type="password"
            id="password"
            placeholder="Nhập mật khẩu"
            value={data.password}
            onChange={handleChange}
            required
            style={{
              height: "60px",
              fontSize: "20px",
              margin: 0,
              backgroundColor: "#fdfff8",
              border: "none",
              borderBottom: "2px solid #1b5e20",
              borderRadius: "0",
            }}
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} 
          />
        </div>
        <Button style={{ display: "flex", justifyContent: "flex-end", color: "#1b5e20", marginBottom: "20px" }} type="link" href="#">
          Quên mật khẩu?
        </Button>
        <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#1b5e20", height: "60px", fontSize: "20px", margin: 0 }}>
          Đăng nhập
        </Button>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
          <div>
            <p style={{ margin: "0", color: "#000", padding: "10px 0" }}>Hoặc đăng nhập bằng</p>
          </div>
          <div style={{ marginLeft: "180px" }}>
            <Button
              onClick={handleFacebookLogin}
              className="social-btn facebook-btn"
              icon={<FaFacebookF />}
              style={{ marginRight: "8px", width: "40px", height: "40px", padding: "0", backgroundColor: "#1877F2", color: "white" }} 
            />
            <Button
              onClick={handleGoogleLogin}
              className="social-btn google-btn"
              icon={<FaGoogle />}
              style={{ width: "40px", height: "40px", padding: "0", backgroundColor: "#DB4437", color: "white" }} 
            />
          </div>
        </div>
      </form>
      <Modal title="Đăng ký tài khoản" open={isSignupOpen} onCancel={() => setIsSignupOpen(false)} footer={null}>
        <SignupPage onClose={openLoginModal} />
      </Modal>
    </div>
  );
}

export default LoginPage;