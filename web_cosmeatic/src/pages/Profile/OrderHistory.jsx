import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Table, Tabs } from 'antd'; // Thêm import cho Table và Tabs
import { jwtDecode } from 'jwt-decode';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  const [orderHistoryData, setOrderHistoryData] = useState([]);

  const orderHistoryColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: (products) =>
        products.map((product, index) => {
          const { productId, quantity } = product; // Destructuring để lấy productId và quantity
          const { imageUrl, name } = productId;  // Destructuring productId
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', flex: 2 }}>
              <div>
                {imageUrl && (
                <img src={imageUrl} alt={name} style={{ width: '50px', height: '50px', margin: "5px 0" }} />
              )}
              </div>
              <div style={{ marginLeft: '10px', fontSize: '14px', color: '#595454' ,  
                          whiteSpace: "normal", // Cho phép chữ xuống dòng
                          wordWrap: "break-word", // Tự động xuống dòng khi quá dài
                          maxWidth: "300px"  }}>
                {name} - Số lượng: {quantity}
              </div>

            </div>
          );
        }),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => `${totalPrice.toLocaleString()} VND`, // Sửa lỗi render totalPrice
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date) => (date ? moment(date).format('MM/DD/YYYY') : 'Chưa thanh toán'),
    },
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      fetchOrderHistory(decoded.userId);
    }
  }, []);

  const fetchOrderHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/orders/userId/${userId}`);
      setOrderHistoryData(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const filterOrdersByStatus = (status) => {
    return orderHistoryData.filter(order => order.status === status);
  };

  return (
    <div className="account-page">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Tất cả" key="1">
          <Table
            columns={orderHistoryColumns}
            dataSource={orderHistoryData}
            rowKey="orderId"
            pagination={false}
            className="order-history-table"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Chờ xác nhận " key="2">
          <Table
            columns={orderHistoryColumns}
            dataSource={filterOrdersByStatus('pending')}
            rowKey="orderId"
            pagination={false}
            className="order-history-table"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đang chờ giao hàng" key="3">
          <Table
            columns={orderHistoryColumns}
            dataSource={filterOrdersByStatus('processing')}
            rowKey="orderId"
            pagination={false}
            className="order-history-table"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đang vận chuyển" key="44">
          <Table
            columns={orderHistoryColumns}
            dataSource={filterOrdersByStatus('shipped')}
            rowKey="orderId"
            pagination={false}
            className="order-history-table"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Giao hàng thành công" key="5">
          <Table
            columns={orderHistoryColumns}
            dataSource={filterOrdersByStatus('success')}
            rowKey="orderId"
            pagination={false}
            className="order-history-table"
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default OrderHistory;