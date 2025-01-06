import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, message } from "antd";
import { FaGoogle, FaFacebookF } from "react-icons/fa"; // Icons
import { login } from "../../services/UserSevices";
import "./LoginPageStyles.css";
import Video from "./video/video.mp4";

function LoginPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(data);
      localStorage.setItem("token", res.token);
      message.success("Đăng nhập thành công");
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
    <div className="containers">
      <div className="container">
        {/* Left Section */}
        <div className="left">
          <video className="background-video" src={Video} autoPlay loop muted />
          <div className="text-overlay">
            <div className="headline">
              <span className="line1">Create And Sell</span>
              <span className="line2">Extraordinary</span>
              <span className="line3">Products</span>
            </div>
            <p>Adopt the peace of nature!</p>
          </div>
          <div className="footer-signup">
            <p>Don't have an account?</p>
            <Link to="/signup" className="signup-button">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="right">
        <h2 style={{ fontWeight: 'bold' }}>Welcome Back!</h2>
          <form onSubmit={handleLogin}>
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
              <label htmlFor="password">Password</label>
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
              Login
            </button>
            <div className="form-footer">
              <p>
                Forgot your password? <a href="#">Click Here</a>
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="social-login">
              <button
                onClick={handleFacebookLogin}
                className="social-btn facebook-btn"
              >
                <FaFacebookF className="social-icon" /> Facebook
              </button>
              <button
                onClick={handleGoogleLogin}
                className="social-btn google-btn"
              >
                <FaGoogle className="social-icon" /> Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
