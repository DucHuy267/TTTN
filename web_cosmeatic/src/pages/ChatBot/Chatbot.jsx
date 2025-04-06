import React, { useState, useEffect } from "react";
import { Input, Button, List, Card, notification, Spin, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          notification.error({
            message: "Phiên đã hết hạn",
            description: "Vui lòng đăng nhập lại.",
          });
          
        }
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
  }, [navigate]);

  const handleSendMessage = async () => {
    if (!input) return;
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return notification.error({ message: "Bạn cần đăng nhập để tiếp tục." });

    const decoded = jwtDecode(storedToken);
    sendMessage(decoded.userId);
  };

  const sendMessage = async (userId) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text: input, user: true }]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:4000/chatbot/chat", { message: input });

      if (response.data.products) {
        setMessages((prev) => [...prev, { products: response.data.products, user: false }]);
      } else {
        setMessages((prev) => [...prev, { text: response.data.reply, user: false }]);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      notification.error({ message: "Không thể gửi tin nhắn, vui lòng thử lại!" });
    } finally {
      setLoading(false);
    }
  };

  const goToProductDetail = (productId) => {
    if (productId) {
        navigate(`/products/${productId}`);
    } else {
        message.error('Thiếu ID sản phẩm.');
    }
};

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Danh sách tin nhắn */}
      <List
        size="small"
        dataSource={messages}
        renderItem={(msg, index) =>
          msg.products ? (
            <div key={index} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {msg.products.map((product) => (
                
                <div key={index}  onClick={() => goToProductDetail(product._id)}
                  style={{ display: 'flex', alignItems: 'center', flex: 2, border: '1px solid #f0f0f0', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}>
                <div>
                  {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '60px', height: '60px', margin: "5px 0" }} />
                )}
                </div>
                <div style={{ marginLeft: '10px', fontSize: '14px', color: '#595454' ,  
                           }}>
                    <p style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "normal", // Cho phép chữ xuống dòng
                            wordWrap: "break-word", // Tự động xuống dòng khi quá dài
                            maxWidth: "300px" }}>
                    {product.name}
                    </p>
                    <p>
                      💰 {product.price}
                    </p>

                </div>
              </div>
              ))}
              
            </div>
          ) : (
            <List.Item key={index} style={{ textAlign: msg.user ? "right" : "left" }}>
              <span
                style={{
                  backgroundColor: msg.user ? "#1890ff" : "#f1f1f1",
                  color: msg.user ? "#fff" : "#000",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  display: "inline-block",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </span>
            </List.Item>
          )
        }
        style={{ flex: 1, overflowY: "auto", padding: "10px" }}
      />

      {/* Ô nhập chat */}
      <div style={{ display: "flex", padding: "10px" }}>
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập tin nhắn..." onPressEnter={handleSendMessage} disabled={loading} />
        <Button type="primary" onClick={handleSendMessage} style={{ marginLeft: "10px" }} disabled={loading}>
          {loading ? <Spin /> : "Gửi"}
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
