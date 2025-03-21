import React, { useState, useEffect } from "react";
import { WapperHeader } from "./style";
import { Button, Table, Tag, Space, Modal, message, Select } from "antd";
import { EditOutlined } from '@ant-design/icons';
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal"; // Import modal chi tiết

const { Option } = Select;

const AdminOrder = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState(null);

    // Fetch orders from the server
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/orders/getAll`);
            const formattedOrders = response.data.data.map(order => ({
                key: order._id,
                orderId: order.orderId,
                userInfo: (
                    <>
                        <b>{order.userInfo.name}</b> <br />
                        {order.userInfo.phone} <br />
                    </>
                ), // Hiển thị tên và số điện thoại người mua
                name: order.userInfo.name, // Lưu lại tên người mua
                phone: order.userInfo.phone, // Lưu lại số điện thoại người mua
                address: order.userInfo.address,
                totalPrice: order.totalPrice,
                status: order.status,
                paymentMethod: order.paymentMethod,
                products: order.products.map(product => ({
                    name: product.productId.name,
                    price: product.productId.price,
                    quantity: product.quantity,
                    imageUrl: product.productId.imageUrl,
                })),
            }));
            setOrders(formattedOrders);
        } catch (error) {
            message.error("Lỗi khi lấy danh sách đơn hàng!");
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderId',
        },
        {
            title: 'User Info',
            dataIndex: 'userInfo',
        },
        {
            title: 'Mã Voucher',
            dataIndex: 'Voucher',
        },
        {
            title: 'Hình thức',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                let statusText = '';
                switch (status) {
                    case 'success':
                        statusText = 'Giao hàng thành công';
                        break;
                    case 'canceled':
                        statusText = 'Đã hủy';
                        break;
                    case 'shipped':
                        statusText = 'Đang giao hàng';
                        break;
                    case 'pending':
                        statusText = 'Chờ xác nhận';
                        break;
                    case 'processing':
                        statusText = 'Chờ lấy hàng';
                        break; 
                    default:
                        statusText = 'Chưa xác định';
                }
        
                return (
                    <Tag color={status === 'success' ? 'green' : status === 'processing' ? 'blue' : status === 'canceled' ? 'red' : status === 'shipped' ? 'orange' : 'gray'}>
                        {statusText}
                    </Tag>
                );
            },
        },        
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button onClick={() => handleDetail(record)}>Xem chi tiết</Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsModalVisible(true);
    };

    const handleDetail = (order) => {
        setSelectedOrder(order); // Lưu thông tin đơn hàng được chọn
        setIsDetailModalVisible(true); // Hiển thị modal chi tiết
    };

    const handleStatusUpdate = async () => {
        if (!newStatus) {
            message.error("Vui lòng chọn trạng thái mới!");
            return;
        }
        try {
            await axios.put(`http://localhost:4000/orders/status/${selectedOrder.key}`, { status: newStatus });
            message.success("Cập nhật trạng thái đơn hàng thành công!");
            fetchOrders();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Lỗi khi cập nhật trạng thái!");
            console.error("Error updating order status:", error);
        }
    };

    return (
        <div>
            <WapperHeader>Danh sách đơn hàng</WapperHeader>

            <Table
                columns={columns}
                dataSource={orders}
                loading={loading}
                pagination={{ pageSize: 10 }}
                style={{
                    marginTop: 20
                }}
            />

            {/* Modal to update order status */}
            <Modal
                title="Update Order Status"
                visible={isModalVisible}
                onOk={handleStatusUpdate}
                onCancel={() => setIsModalVisible(false)}
                okText="Update"
                cancelText="Cancel"
            >
                <Select
                    value={newStatus}
                    onChange={setNewStatus}
                    style={{ width: '100%' }}
                    placeholder="Select a status"
                >
                    <Option value="pending">Chờ xác nhận</Option>
                    <Option value="processing">Chờ lấy hàng</Option>
                    <Option value="shipped">Đang giao hàng</Option>
                    <Option value="success">Giao hàng thành công</Option>
                    <Option value="canceled">Đã hủy</Option>
                </Select>
            </Modal>

            {/* Modal to view order details */}
            <OrderDetailModal
                visible={isDetailModalVisible}
                onClose={() => setIsDetailModalVisible(false)}
                order={selectedOrder}
                onConfirm={fetchOrders} // Pass fetchOrders as onConfirm prop
            />
        </div>
    );
};

export default AdminOrder;
