import { MessageOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';


const ChatButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        onClick={showModal}
        className="chat-button" // Áp dụng style cho nút chat
      />
      <Modal
        title="Hộp chat"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        {/* Nội dung của hộp chat */}
      </Modal>
    </div>
  );
};

export default ChatButton;