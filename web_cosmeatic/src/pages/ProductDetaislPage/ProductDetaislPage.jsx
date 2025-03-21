import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, message, Col, Row, Modal } from 'antd';
import { ShoppingOutlined, PlusOutlined, MinusOutlined, } from '@ant-design/icons';
import { getDetailProduct } from '../../services/ProductServices';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Comments from './Comments';
import { Span } from '../../components/HeaderComponents/style';
import Suggest from './Suggest';
import Ingredient from './Ingredient';

const ProductDetailsPage = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState(null); // State to store userId
    const [isModalVisible, setIsModalVisible] = useState(false); // State for Modal visibility

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken); // Decode token to get userId
                setUserId(decoded.userId);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const productData = await getDetailProduct(_id);
                if (productData) {
                    setProduct(productData);
                } else {
                    setError("Could not fetch product details.");
                    message.error("Failed to load product details.");
                }
            } catch (err) {
                setError("Failed to load product details.");
            }
            setLoading(false);
        };
        fetchProductDetail();
    }, [_id]);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };

    const showLoginModal = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        navigate('/login'); // Redirect to login page
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddToCart = async () => {
        if (!userId) {
            showLoginModal(); // Hiển thị modal đăng nhập nếu chưa đăng nhập
            return;
        }
    
        if (!_id) {
            message.error("Product ID is required");
            return;
        }
    
        // Lấy thông tin sản phẩm (bao gồm tồn kho)
        try {
    
            if (quantity > product.quantity) {
                message.warning(`Sản phẩm chỉ còn ${product.quantity} trong kho. Vui lòng điều chỉnh số lượng.`);
                return;
            }
    
            const data = {
                userId: userId,
                productId: _id,
                quantity: quantity,
            };
    
            // Thêm vào giỏ hàng
            const response = await axios.post('http://localhost:4000/carts/add', data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response.status === 200) {
                message.success('Thêm sản phẩm vào giỏ hàng thành công');
            }
        } catch (error) {
            // message.error('Lỗi khi thêm sản phẩm vào giỏ hàng');
            message.warning(`Sản phẩm chỉ còn ${product.quantity} trong kho. Vui lòng điều chỉnh số lượng.`);
            console.error(error);
        }
    };
    

    if (loading) return <Spin style={{ display: 'block', margin: '20px auto' }} />;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div style={{ backgroundColor: '#fdfff8' }}>
            {/* // chi tiết */}
            <div style={{ padding: 20, margin: '0 auto' }}>
                <div style={{ flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Row>
                        <Col span={10}>
                            <div style={{ marginLeft: '80px' }}>
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt="product"
                                        style={{ width: '400px', height: '430px', maxWidth: '700px', maxHeight: '700px' }}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className='top' style={{  maxWidth: '550px',  marginLeft: '100px', 
                                display: 'flex', flexDirection: 'column', height: '100%' 
                            }}>
                                <h1 style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: '-moz-initial' }}>{product.name}</h1>
                                <p style={{ fontSize: '20px', color: 'red', fontFamily: '-moz-initial' }}>{`${product.price.toLocaleString('vi-VN')} đ`}</p>
                                <p style={{ fontSize: '18px', fontFamily: '-moz-initial' }}>kho: {product.quantity}</p>
                                <p style={{ fontSize: '18px', fontFamily: '-moz-initial' }}>{product.description}</p>

                                <div className='bottom' style={{ display: 'flex', 
                                    alignItems: 'center', gap: '20px', marginTop: 'auto' 
                                }}>
                                    <div className='quantity'>
                                        <div style={{  width: '150px', border: '1px solid #ccc', 
                                            display: 'flex', alignItems: 'center' 
                                        }}>
                                            <Button style={{ width: 50, height: 50, border: 'none', }} onClick={() => handleQuantityChange(quantity - 1)}>
                                                <MinusOutlined />
                                            </Button>
                                            <input
                                                value={quantity}
                                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                                size='small'
                                                style={{ textAlign: 'center', width: 50, height: 50 , fontSize: 18, border: 'none' }}
                                            />
                                            <Button style={{ width: 50, height: 50, border: 'none',  }} onClick={() => handleQuantityChange(quantity + 1)}>
                                                <PlusOutlined />
                                            </Button>
                                        </div>
                                    </div>
                                    <div style={{marginLeft: 40}}>
                                        <Button
                                            type="primary"
                                            icon={<ShoppingOutlined />}
                                            style={{ width: '320px', height: '50px', background: '#000', fontFamily: '-moz-initial' }}
                                            onClick={handleAddToCart}
                                        >
                                            <span style={{ fontSize: '18px', color: '#fff' }}>Thêm vào giỏ hàng</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </div>
            </div>

            <div style={{ marginLeft: 30, marginRight: 30 }}>
                <Ingredient sections={product.sections} />
            </div>

            <div style={{ marginLeft: 30, marginRight: 30 }}>
                <Comments productId={_id} userId={userId}  />
            </div>

            <hr style={{ margin: 20, }}></hr>

            <Suggest productId={_id} userId={userId} />

            {/* Modal for login prompt */}
            <Modal
                title="Login Required"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Login"
                cancelText="Cancel"
            >
                <p>Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng của mình. Vui lòng đăng nhập để tiếp tục.</p>
            </Modal>
        </div>
    );
};

export default ProductDetailsPage;
