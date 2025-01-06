import React from "react";
import { Modal, Table, Button, message } from "antd";
import axios from "axios";

const OrderDetailModal = ({ visible, onClose, order, onConfirm }) => {
    const columns = [
        {
            title: "Hình ảnh & Sản phẩm",
            dataIndex: "name",
            key: "name",
            render: (name, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={record.imageUrl}
                        alt="product"
                        style={{
                            height: "60px",
                            width: "60px",
                            borderRadius: "10%",
                            marginRight: "10px",
                            objectFit: "cover",
                        }}
                    />
                    <span>{name}</span>
                </div>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price.toLocaleString("vi-VN")} đ`,
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Thành tiền",
            key: "total",
            render: (_, record) => `${(record.price * record.quantity).toLocaleString("vi-VN")} đ`,
        },
    ];

    // Tính tổng số lượng sản phẩm
    const totalQuantity = order?.products.reduce((sum, product) => sum + product.quantity, 0) || 0;

    const handleStatusUpdate = async () => {
        try {
            const response = await axios.put(
                `http://localhost:4000/orders/status/${order.key}`, { status: "pendingPickup" } 
            );
            message.success("Xác nhận đơn hàng thành công!");
            onConfirm && onConfirm(response.data); // Optionally, call onConfirm prop after updating
        } catch (error) {
            message.error("Lỗi khi xác nhận trạng thái đơn hàng!");
            console.error("Error updating order status:", error);
        }
    };

    return (
        <Modal
            title={<b style={{ color: '#528000', fontWeight: 'bold', fontSize: 20 }}>Chi tiết đơn hàng</b>}
            style={{ top: 20 }}
            visible={visible}
            onCancel={onClose}
            width={1000}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    onClick={handleStatusUpdate}
                    disabled={order?.status === 'success' || order?.status === 'canceled' || order?.status === 'pendingPickup'} 
                >
                    Xác nhận đơn hàng
                </Button>,
            ]}
        >
            {order ? (
                <>
                    <p><b>Mã đơn hàng:</b> {order.orderId}</p>
                    <p><b>Người mua:</b> {order.name}</p>
                    <p><b>Số điện thoại:</b> {order.phone}</p>
                    <p><b>Địa chỉ:</b> {order.address}</p>
                    <hr style={{ marginTop: 20, marginBottom: 20 }} />
                    <Table
                        columns={columns}
                        dataSource={order.products}
                        pagination={false}
                        rowKey={(record, index) => index}
                    />
                    <p style={{ textAlign: "right", fontWeight: "bold", marginTop: "20px" }}>
                        Tổng tiền ({totalQuantity} sản phẩm): {order.totalPrice.toLocaleString("vi-VN")} đ
                    </p>
                    <hr style={{ marginTop: 20, marginBottom: 20 }} />
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <p style={{ marginRight: "10px" }}><b>Phương thức thanh toán:</b></p>
                        <p
                            style={{
                                border: "1px solid #528000",
                                padding: "5px",
                                marginBottom: "20px",
                                fontWeight: "bold",
                                color: "#333",
                                display: "inline-block",
                            }}
                        >
                            {order.paymentMethod}
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <p style={{ marginRight: "10px" }}><b>Trạng thái đơn hàng:</b></p>
                        <p
                            style={{
                                border: "1px solid #528000",
                                padding: "5px",
                                fontWeight: "bold",
                                color: "#333",
                                display: "inline-block",
                                textAlign: "center",
                            }}
                        >
                            {order.status}
                        </p>
                    </div>
                </>
            ) : (
                <p>Không có thông tin đơn hàng.</p>
            )}
        </Modal>
    );
};

export default OrderDetailModal;
