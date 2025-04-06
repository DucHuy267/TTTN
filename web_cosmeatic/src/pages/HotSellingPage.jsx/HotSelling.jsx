import React, { useState, useEffect } from 'react';
import { Button, message, Card, Modal, Spin, Rate } from 'antd';
import { LeftOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const HotSelling = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState(location.state?.products || []); 
    const [userId, setUserId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Lấy số lượng sản phẩm đã bán và đánh giá sao
        const fetchProductData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/dmf/productCountsAll');
                const productCountsData = response.data || [];

                // Kết hợp số lượng và đánh giá sao vào sản phẩm
                const updatedProducts = await Promise.all(
                    products.map(async (product) => {
                        const productCount = productCountsData.find(count => count._id === product._id);
                        const rating = await fetchRating(product.product._id); // Lấy đánh giá sao
                        return {
                            ...product,
                            count: productCount ? productCount.count : 0,
                            rating, // Thêm đánh giá sao
                        };
                    })
                );

                setProducts(updatedProducts); // Cập nhật lại state products
            } catch (error) {
                console.error("Failed to fetch product data:", error);
            }
        };

        if (products.length > 0) {
            fetchProductData();
        }
    }, [products]);

        // Hàm lấy đánh giá sao
        const fetchRating = async (productId) => {
            try {
                const response = await axios.get(`http://localhost:4000/comments/getCommentsByProductId/${productId}`);
                const comments = response.data.data.comments || [];
                if (comments.length > 0) {
                    const averageRating = comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length;
                    return averageRating;
                }
                return 0; // Mặc định là 0 nếu không có bình luận
            } catch (error) {
                console.error('Lỗi khi tải đánh giá:', error);
                return 0;
            }
        };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setUserId(decoded.userId);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }
    }, []);


    const goToProductDetail = (productId) => {
        if (productId) {
            navigate(`/products/${productId}`);
        } else {
            message.error('Product ID is missing.');
        }
    };

    const showLoginModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // thêm vào giỏ
    const handleAddToCart = async (productId, quantity, e) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (!userId) {
            showLoginModal(); // Hiển thị modal đăng nhập nếu chưa đăng nhập
            return;
        }
    
        try {
    
            if (quantity < 1) {
                message.warning('Sản phẩm đã hết hàng. Vui lòng quay lại sau.');
                return;
            } 
    
            const data = {
                userId,
                productId,
                quantity: 1, // Số lượng mặc định
            };
    
            // Thêm vào giỏ hàng
            const response = await axios.post('http://localhost:4000/carts/add', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                message.success('Thêm sản phẩm vào giỏ hàng thành công');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error.response?.data || error);
            // message.error('Lỗi khi thêm sản phẩm vào giỏ hàng');
            message.warning('sản phẩm vượt quá số lượng trong kho để thêm vào giỏ')
        }
    };

    return (
        <div>
            {loading ? (
                <Spin size="large" />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', padding: '20px' }}>
                    {products.length > 0 ? (
                        products.map((item) => (
                            <Card
                            hoverable
                            style={{ width: '260px', margin: '0 5px' }}
                            cover={
                                    item.product.imageUrl && (
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        style={{
                                            height: '240px',
                                            objectFit: 'cover',
                                            borderRadius: '8px 8px 0 0',
                                        }}
                                    />
                                )
                            }
                            onClick={() => goToProductDetail(item.product._id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.product.name}</div>
                                    <div style={{ fontSize: '14px', color: '#888' }}>
                                        {`${item.product.price.toLocaleString('vi-VN')} đ`}
                                    </div>
                                    <div>{item.totalSold} đã bán</div>
                                    <Rate disabled value={item.product.rating} />
                                </div>
                                <Button
                                    icon={<ShoppingOutlined />}
                                    onClick={(e) => handleAddToCart(item.product._id, item.product.quantity, e)}
                                    style={{
                                        marginTop: '30px',
                                        width: '38px',
                                        backgroundColor: '#D0EFC4',
                                        color: '#000',
                                        border: 'none',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    size="middle"
                                />
                            </div>
                        </Card>
                        ))
                    ) : (
                        <p>Không có sản phẩm để hiển thị.</p>
                    )}
                </div>
            )}

            <Modal
                title="Yêu cầu đăng nhập"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Đăng nhập"
                cancelText="Hủy"
            >
                <p>Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Vui lòng đăng nhập để tiếp tục.</p>
            </Modal>
        </div>
    );
};

export default HotSelling;
