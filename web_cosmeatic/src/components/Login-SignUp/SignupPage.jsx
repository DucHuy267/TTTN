import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, message, Modal } from "antd";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { signup } from "../../services/UserSevices";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import LoginPage from "./LoginPage";

function SignupPage({ onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginModal = () => {
    onClose();
    setIsLoginOpen(true);
  };

  const openSignupModal = () => {
    setIsLoginOpen(false);
    onClose();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      message.success("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div style={{ margin: "40px 20px", justifyContent: "center", alignItems: "center", backgroundColor: "#fdfff8" }}>
      <p style={{ fontWeight: "bold", fontSize: "25px", fontFamily: "serif", margin: 0 }}>Chào mừng đến với Audora</p>
      <div style={{ display: "flex" }}>
        <p style={{ padding: "5px 0", color: "#b8b6af" }}>Bạn đã có tài khoản?</p>
        <Button style={{ color: "#1b5e20", padding: "0 5px" }} type="link" onClick={openLoginModal}>
          Đăng nhập
        </Button>
      </div>
      <form onSubmit={handleRegisterClick}>
        <div style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Input
            type="email"
            id="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ height: "60px", fontSize: "20px", borderBottom: "2px solid #1b5e20", borderRadius: "0" }}
            prefix={<MailOutlined style={{ fontSize: "20px" }} />}
          />
        </div>
        <div style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Input
            type="text"
            id="name"
            placeholder="Nhập họ tên"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ height: "60px", fontSize: "20px", borderBottom: "2px solid #1b5e20", borderRadius: "0" }}
            prefix={<UserOutlined style={{ fontSize: "20px" }} />}
          />
        </div>
        <div style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Input
            type="text"
            id="phone"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ height: "60px", fontSize: "20px", borderBottom: "2px solid #1b5e20", borderRadius: "0" }}
            prefix={<PhoneOutlined style={{ fontSize: "20px" }} />}
          />
        </div>
        <div style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Input.Password
            id="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ height: "60px", fontSize: "20px", borderBottom: "2px solid #1b5e20", borderRadius: "0" }}
            prefix={<LockOutlined style={{ fontSize: "20px" }} />}
          />
        </div>
        <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#1b5e20", height: "60px", fontSize: "20px" }}>
          Đăng ký
        </Button>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
          <p style={{ margin: "0", color: "#000", padding: "10px 0" }}>Hoặc đăng ký bằng</p>
          <div style={{ marginLeft: "180px" }}>
            <Button className="social-btn facebook-btn" icon={<FaFacebookF />} style={{ marginRight: "8px", width: "40px", height: "40px", backgroundColor: "#1877F2", color: "white" }} />
            <Button className="social-btn google-btn" icon={<FaGoogle />} style={{ width: "40px", height: "40px", backgroundColor: "#DB4437", color: "white" }} />
          </div>
        </div>
      </form>
      <Modal title="Đăng nhập" open={isLoginOpen} onCancel={() => setIsLoginOpen(false)} footer={null}>
        <LoginPage onClose={openSignupModal} />
      </Modal>
    </div>
  );
}

export default SignupPage;