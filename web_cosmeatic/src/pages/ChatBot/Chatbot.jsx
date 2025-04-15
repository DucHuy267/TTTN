import React, { useState, useEffect } from "react"; 
import { Input, Button, List, Card, notification, Spin, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [inputHint, setInputHint] = useState("Nhập tin nhắn...");
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

    const history = localStorage.getItem("adoraChat");
    const welcomeMessage = {
      text: "Adora xin chào bạn 👋! Hãy liên hệ với chúng tôi khi bạn không tìm thấy được dòng sản phẩm mà bạn cần hoặc thích hợp với da của bạn?",
      user: false,
    };

    if (history) {
      const parsed = JSON.parse(history);
      const hasWelcome = parsed.some(
        (msg) => msg.text && msg.text.includes("Adora xin chào")
      );
      if (!hasWelcome) {
        setMessages([welcomeMessage, ...parsed]);
      } else {
        setMessages(parsed);
      }
    } else {
      setMessages([welcomeMessage]);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/products/popular");
        setMessages((prev) => [
          ...prev,
          { text: "Dưới đây là một số sản phẩm nổi bật của Adora:", user: false },
          { products: res.data, user: false },
        ]);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm phổ biến:", err);
      }
    };
    fetchPopularProducts();
  }, []);

  useEffect(() => {
    const hints = [
      "Bạn cần sản phẩm trị mụn?",
      "Tìm sữa rửa mặt phù hợp da dầu?",
      "Bạn đang tìm sản phẩm dưỡng trắng?",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setInputHint(hints[i]);
      i = (i + 1) % hints.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("adoraChat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastIndex = messages.length - 1;
    const lastMessage = messages[lastIndex];

    if (lastMessage.products && !lastMessage.reviewSuggested) {
      const timer = setTimeout(() => {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            reviewSuggested: true,
          };
          return [
            ...updatedMessages,
            {
              text: "📢 Bạn đã dùng sản phẩm nào chưa? Hãy để lại đánh giá để Adora cải thiện dịch vụ nhé!",
              user: false,
            },
          ];
        });
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input) return;
    const storedToken = localStorage.getItem("token");
    if (!storedToken)
      return notification.error({ message: "Bạn cần đăng nhập để tiếp tục." });

    const decoded = jwtDecode(storedToken);
    sendMessage(decoded.userId);
  };

  const sendMessage = async (userId) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text: input, user: true }]);
    const userInput = input;
    setInput("");

    try {
      const response = await axios.post("http://localhost:4000/chatbot/chat", {
        message: userInput,
      });

      if (response.data.products) {
        setMessages((prev) => [
          ...prev,
          { products: response.data.products, user: false },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: response.data.reply, user: false },
        ]);
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
      message.error("Thiếu ID sản phẩm.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(to bottom, #fdfdfd, #f6f9ff)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e0e0e0",
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          zIndex: 1,
        }}
      >
        <img
          src="https://i.pinimg.com/736x/30/9d/76/309d7603c4f39ad74cf1d5ccea23c2de.jpg"
          alt="Adora"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #28a745",
          }}
        />
        <h2 style={{ margin: 0, fontSize: "20px", color: "#28a745" }}>Adora</h2>
      </div>

      <List
        size="small"
        dataSource={messages}
        renderItem={(msg, index) =>
          msg.products ? (
            <div
              key={index}
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "12px",
                padding: "12px 0",
                scrollbarWidth: "none",
              }}
            >
              {msg.products.map((product) => (
                <Card
                  key={product._id}
                  hoverable
                  style={{
                    minWidth: 160,
                    maxWidth: 160,
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    flexShrink: 0,
                  }}
                  onClick={() => goToProductDetail(product._id)}
                  cover={
                    product.imageUrl ? (
                      <img
                        alt={product.name}
                        src={product.imageUrl}
                        style={{
                          height: 100,
                          objectFit: "cover",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      />
                    ) : null
                  }
                >
                  <Card.Meta
                    title={
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </div>
                    }
                    description={
                      <div style={{ color: "#28a745", fontWeight: "bold", fontSize: "13px" }}>
                        💰 {product.price}
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>
          ) : (
            <List.Item
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.user ? "flex-end" : "flex-start",
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: msg.user ? "#109011" : "#e8f5e9",
                  color: msg.user ? "#fff" : "#2e7d32",
                  padding: "12px 18px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  fontSize: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  wordBreak: "break-word",
                  transition: "all 0.3s",
                }}
              >
                {msg.text}
              </div>
            </List.Item>
          )
        }
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "#f9fcff",
        }}
      />

      <div
        style={{
          display: "flex",
          padding: "15px 20px",
          borderTop: "1px solid #e0e0e0",
          background: "#fff",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputHint}
          onPressEnter={handleSendMessage}
          disabled={loading}
          style={{
            borderRadius: "30px",
            padding: "12px 20px",
            fontSize: "15px",
            flex: 1,
            backgroundColor: "#f0f2f5",
            border: "none",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        <Button
          type="primary"
          onClick={handleSendMessage}
          style={{
            marginLeft: "10px",
            borderRadius: "30px",
            height: "42px",
            padding: "0 25px",
            fontWeight: 600,
            backgroundColor: "#008001",
            border: "none",
            boxShadow: "0 3px 10px rgba(78, 52, 46, 0.3)",
          }}
          disabled={loading}
        >
          {loading ? <Spin size="small" /> : "Gửi"}
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
