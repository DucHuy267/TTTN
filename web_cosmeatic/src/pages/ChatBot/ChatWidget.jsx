import React, { useState } from "react";
import Chatbot from "./Chatbot";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Nút mở chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#1b5e20",
          color: "#fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 9999, // Đảm bảo nút luôn hiển thị trên các phần khác
        }}
      >
        💬
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "400px",
            height: "400px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              float: "right",
              border: "none",
              background: "red",
              color: "#fff",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
