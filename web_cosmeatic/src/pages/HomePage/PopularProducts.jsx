import React, { useEffect, useState } from 'react';  
import { Card, Button, message, Rate } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const PopularProducts = () => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setUserId(decoded.userId);
            } catch (error) {
                console.error('Không thể giải mã token:', error);
            }
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/dmf/hot-selling-products`);
            if (res.data) {
                // Lấy đánh giá cho từng sản phẩm
                const productsWithRatings = await Promise.all(
                    res.data.map(async (product) => {
                        const rating = await fetchRating(product.product._id);
                        return { ...product, rating };
                    })
                );
                setProducts(productsWithRatings);
                console.log('productsWithRatings',productsWithRatings);
            }
        } catch (error) {
            message.error('Không thể tải danh sách sản phẩm.');
        }
    };

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

    const goToProductDetail = (productId) => {
        if (productId) {
            navigate(`/products/${productId}`);
        } else {
            message.error('Thiếu ID sản phẩm.');
        }
    };

    const handleAddToCart = async (productId, quantity, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            message.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            return;
        }

        if (quantity < 1) {
            message.warning('Sản phẩm đã hết hàng. Vui lòng quay lại sau.');
            return;
        }

        try {
            const data = {
                userId,
                productId,
                quantity: 1,
            };

            const response = await axios.post('http://localhost:4000/carts/add', data, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                message.success('Thêm sản phẩm vào giỏ hàng thành công');
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error.response?.data || error);
            message.warning('Sản phẩm vượt quá số lượng trong kho.');
        }
    };

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2
                    style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        color: '#357d18',
                        fontFamily: 'Nunito',
                        textTransform: 'uppercase',
                    }}
                >
                    Top sản phẩm bán chạy
                </h2>

                <div style={{ flex: '3', overflowX: 'auto', margin: '0 50px' }}>
                    {products.length > 0 ? (
                        <div style={{ display: 'flex' }}>
                         {products.slice(0, 10).map((item) => (  
                                <div key={item.product._id} style={{ marginRight: '16px', flexShrink: 0 }}>
                                    <Card
                                        hoverable
                                        style={{ width: '270px', margin: '0 10px' }}
                                        cover={
                                            item.product.imageUrl && (
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    style={{
                                                        height: '255px',
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
                                                <div style={{ fontSize: '12px' }}>{item.product.name}</div>
                                                <div style={{ fontSize: '12px' }}>
                                                    {`${item.product.price.toLocaleString('vi-VN')} đ`}
                                                </div>
                                                <div>{item.totalSold} đã bán</div>
                                                <Rate disabled value={item.rating} />
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', width: '100%' }}>Không có sản phẩm phổ biến.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopularProducts;
