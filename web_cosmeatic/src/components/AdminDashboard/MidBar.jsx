import React, { useEffect, useState } from "react";
import video from "../AdminDashboard/video/video.mp4";
import cocoonImage from './cocoon_1.png';
import cocoonImage2 from './cocoon_2.png';
import axios from "axios";
import { message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

function MidBar({ onGoToOrders, onGoToChart }) {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [todayOrders, setTodayOrders] = useState(0);
    const [monthOrders, setMonthOrders] = useState(0);


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

            
            // Tính số order hôm nay và trong tháng
            const now = new Date();
            let todayCount = 0;
            let monthCount = 0;

            response.data.data.forEach(order => {
                const createdAt = new Date(order.createdAt);
            
            // So sánh ngày/tháng/năm cho "hôm nay"
            const isToday =
                createdAt.getDate() === now.getDate() &&
                createdAt.getMonth() === now.getMonth() &&
                createdAt.getFullYear() === now.getFullYear();

            // So sánh tháng và năm cho "tháng này"
            const isThisMonth =
                createdAt.getMonth() === now.getMonth() &&
                createdAt.getFullYear() === now.getFullYear();

            if (isToday) todayCount++;
            if (isThisMonth) monthCount++;
        });

        setTodayOrders(todayCount);
        setMonthOrders(monthCount);
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



    return (
        <div className="Midbar">
            <div className="videocontainer">
                <div className="videodiv">
                    <video autoPlay loop muted>
                        <source src={video} type="video/mp4" />
                    </video>
                </div>

                <h2 style={{ fontWeight: 'bold', fontSize: '16px' }}>Tạo và bán các sản phẩm đặc biệt</h2>

                <p>
                    Ngành công nghiệp đang phát triển nhanh chóng trên thế giới là sản phẩm được làm từ tự nhiên!
                </p>
                <div className="midbarbtndiv">
                    <button className="midbarexploreBTN">Khám phá thêm</button>
                    <button
                        className="midbarsellersBTN"
                        style={{
                            background: "transparent",
                            color: "white",
                            border: "2px solid white"
                        }}
                        onClick={onGoToChart}
                    >
                        Bán chạy nhất
                    </button>
                </div>
            </div>

            <div className="Mystatcontainer">
                <h2>Số lượng đơn hàng đã bán</h2>
                <div className="statmid">
                    <div className="statmidleft">
                        <p>Hôm nay </p>
                        <p style={{ color: "rgb(110, 141, 64)" }}>{todayOrders}</p>{" "}
                    </div>
                    <div className="statmidright">
                        <p>Tháng này </p>
                        <p style={{ color: "rgb(110, 141, 64)" }}>{monthOrders}</p>
                    </div>
                </div>
                <h4 onClick={onGoToOrders} style={{ cursor: 'pointer' }}>
                    Đi đến danh sách đơn hàng < ArrowRightOutlined/>
                </h4>


                <img
                    className="mystatplantpotimg"
                    src={cocoonImage}
                    alt="Cocoon"
                />
            </div>

            <img
                className="lambader"
                src={cocoonImage2}
                alt=""
                style={{ objectFit: 'fill' }}
            />
        </div>
    );
}

export default MidBar;
