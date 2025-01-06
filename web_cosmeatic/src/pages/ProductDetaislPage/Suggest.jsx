import { ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Suggest = ({ userId }) => {   
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelatedProducts = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:4000/dmf/top-products/${userId}`);
                if (response.data) {
                    setRelatedProducts(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch related products:", error);
                message.error("Không thể tải sản phẩm gợi ý. Vui lòng thử lại.");
            }
        };
    
        if (userId) {
            fetchRelatedProducts(userId);
        }
    }, [userId]);

    const handleAddToCart1 = async (productId, quantity, e) => {
        e.preventDefault();
        e.stopPropagation();
    
        try {
            if (quantity < 1) {
                message.warning('Sản phẩm đã hết hàng. Vui lòng quay lại sau.');
                return;
            } 
    
            const data = {
                userId,
                productId,
                quantity: 1,
            };
    
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
            message.warning('sản phẩm vượt quá số lượng trong kho để thêm vào giỏ');
        }
    };

    const goToProductDetail = (productId) => {
        if (productId) {
            navigate(`/product/${productId}`);
        } else {
            message.error('Product ID is missing.');
        }
    };

    return (
       <div>
            <div style={{marginLeft: 30, marginRight:30}}>
                <p style={{marginLeft: 20, fontSize: 28, fontWeight: 'bold', fontFamily: '-moz-initial'}}>Gợi ý dành cho riêng bạn</p>
                <div style={{ flex: '3', overflowX: 'auto' }}>
                    {relatedProducts.length > 0 ? (
                        <div style={{ display: 'flex' }}>
                            {relatedProducts.map((product) => (
                                <div key={product._id} style={{ marginRight: '16px', flexShrink: 0 }}>
                                    <Card
                                        hoverable
                                        style={{ width: '220px' }}
                                        cover={
                                            product.imageUrl && (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    style={{
                                                        height: '205px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px 8px 0 0',
                                                    }}
                                                />
                                            )
                                        }
                                        onClick={() => goToProductDetail(product._id)}
                                    >
                                        <Card.Meta
                                            title={<div style={{ fontSize: '16px', fontWeight: 'bold' }}>{product.name}</div>}
                                            description={
                                                <div style={{ fontSize: '14px', color: '#888' }}>
                                                    {`${product.price.toLocaleString('vi-VN')} đ`}
                                                </div>
                                            }
                                        />
                                        <Button
                                            icon={<ShoppingOutlined />}
                                            onClick={(e) => handleAddToCart1(product._id, product.quantity, e)}
                                            style={{
                                                marginTop: '10px',
                                                width: '100%',
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                border: 'none',
                                            }}
                                        >
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', width: '100%' }}>Không có sản phẩm gợi ý.</p>
                    )}
                </div>
            </div>
       </div>
    );
};

export default Suggest;
