import React, { useEffect, useState } from "react";
import { Input, Button, List, Typography, notification } from "antd";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const { Text } = Typography;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        try {
            const decoded = jwtDecode(storedToken);
            if (decoded.exp * 1000 < Date.now()) {
                notification.error({
                    message: 'Phiên đã hết hạn',
                    description: 'Vui lòng đăng nhập lại.',
                });
                Navigate('/login');
                return;
            }
            const userId = decoded.userId;
            sendMessage(userId);
        } catch (error) {
            console.error("Lỗi khi giải mã token:", error);
        }
    }
}, []);

  const handleSendMessage = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      sendMessage(decoded.userId);
    }
  };

  const sendMessage = async (userId) => {
    if (!input) return;

    const userMessage = { text: input, user: true };
    setMessages((prev) => [...prev, userMessage]);

    let response;
    if (input.toLowerCase().includes("thêm vào giỏ") || input.toLowerCase().includes("mua")) {
      const productName = input.replace(/(thêm vào giỏ|mua)/gi, "").trim();
      response = await axios.post("http://localhost:4000/chatbot/cart/add", { userId: userId, productName });
    } else {
      response = await axios.get("http://localhost:4000/chatbot/chat", { message: input });
    }

    const botMessage = { text: response.data.reply, user: false };
    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Danh sách tin nhắn */}
      <List
        size="small"
        dataSource={messages}
        renderItem={(msg, index) => (
          <List.Item key={index} style={{ textAlign: msg.user ? "right" : "left" }}>
            <Text
              style={{
                backgroundColor: msg.user ? "#1890ff" : "#f1f1f1",
                color: msg.user ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              {msg.text}
            </Text>
          </List.Item>
        )}
        style={{ flex: 1, overflowY: "auto", padding: "10px" }}
      />

      {/* Ô nhập chat */}
      <div style={{ display: "flex", padding: "10px" }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onPressEnter={handleSendMessage} // Gọi hàm mới để lấy userId
        />
        <Button type="primary" onClick={handleSendMessage} style={{ marginLeft: "10px" }}>
          Gửi
        </Button>;
      </div>
    </div>
  );
};

export default Chatbot;
