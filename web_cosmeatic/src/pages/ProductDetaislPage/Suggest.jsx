import { ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, message, Rate } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Suggest = ({ userId }) => {   
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`http://localhost:4000/dmf/top-products/${userId}`);
                setRelatedProducts(response.data || []);
            } catch (error) {
                console.error("Failed to fetch related products:", error);
                message.error("Không thể tải sản phẩm gợi ý. Vui lòng thử lại.");
            }
        };
        fetchRelatedProducts();
    }, [userId]);

    const handleAddToCart = async (productId, quantity, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            if (quantity < 1) {
                message.warning('Sản phẩm đã hết hàng. Vui lòng quay lại sau.');
                return;
            }
            
            const response = await axios.post('http://localhost:4000/carts/add', {
                userId,
                productId,
                quantity: 1,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            if (response.status === 200) {
                message.success('Thêm sản phẩm vào giỏ hàng thành công');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error.response?.data || error);
            message.warning('Sản phẩm vượt quá số lượng trong kho để thêm vào giỏ');
        }
    };

    const goToProductDetail = (productId) => {
        if (productId) {
            navigate(`/products/${productId}`);
        } else {
            message.error('Product ID is missing.');
        }
    };

    return (
        <div style={{ margin: '0 50px' }}>
            <p style={{ fontSize: 28, fontWeight: 'bold', fontFamily: 'Arial', marginBottom: 20 }}>
                Gợi ý dành cho bạn
            </p>
            <div style={{ flex: '3', overflowX: 'auto' }}>
                {relatedProducts.length > 0 ? (
                    <div style={{ display: 'flex' }}>
                        {relatedProducts.map((product) => (
                            <div key={product._id} style={{ marginRight: '16px', flexShrink: 0 }}>
                                <Card
                                    hoverable
                                    style={{ width: '270px', margin: '0 10px' }}
                                    cover={
                                        product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                style={{
                                                    height: '255px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px 8px 0 0',
                                                }}
                                            />
                                        )
                                    }
                                    onClick={() => goToProductDetail(product._id)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{product.name}</div>
                                            <div style={{ fontSize: '14px', color: '#888' }}>
                                                {`${product.price.toLocaleString('vi-VN')} đ`}
                                            </div>
                                            <div>{product.totalSold} đã bán</div>
                                            <Rate disabled value={product.rating} />
                                        </div>
                                        <Button
                                            icon={<ShoppingOutlined />}
                                            onClick={(e) => handleAddToCart(product._id, product.quantity, e)}
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
                    <p style={{ textAlign: 'center', width: '100%' }}>Không có sản phẩm gợi ý.</p>
                )}
            </div>
        </div>
    );
};

export default Suggest;
