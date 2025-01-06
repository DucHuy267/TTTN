import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css"; // Thêm CSS cho chatbot (tùy chỉnh sau)

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  // Hàm gửi tin nhắn đến Rasa
  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMessage]); // Hiển thị tin nhắn người dùng

    setInput(""); // Xóa input

    setLoading(true); // Hiển thị trạng thái loading
    try {
    const response = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
        sender: "user",
        message: input,
    });
    const botMessages = response.data.map((botMessage) => ({
        sender: "bot",
        message: botMessage.text,
    }));
    setMessages((prev) => [...prev, ...botMessages]);
    } catch (error) {
    console.error("Error sending message:", error);
    setMessages((prev) => [...prev, { sender: "bot", message: "Có lỗi xảy ra!" }]);
    } finally {
    setLoading(false); // Kết thúc trạng thái loading
    }

  };

  // Xử lý sự kiện khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default Chatbot;
