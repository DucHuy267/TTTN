import React, { useEffect, useState } from 'react';
import { Card, Button, message, Rate } from 'antd';
import { ArrowRightOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getDetailCategory } from "../../services/CategoryServices";
import { getProductByCate } from "../../services/ProductServices";

const PopularCate = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy userId từ token
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    const decoded = jwtDecode(storedToken);
                    setUserId(decoded.userId);
                }

                // Lấy sản phẩm theo categoryId
                if (categoryId) {
                    // Lấy danh sách sản phẩm theo categoryId
                    const res = await axios.get(`http://localhost:4000/products/categoryTrue/${categoryId}`);
                    const productsData = res.data || [];

                    // Lấy số lượng sản phẩm đã bán (lấy tất cả một lần)
                    const productCountsRes = await axios.get('http://localhost:4000/dmf/productCountsAll');
                    const productCountsData = productCountsRes.data || [];

                    // Kết hợp số lượng và đánh giá sao vào sản phẩm
                    const updatedProducts = await Promise.all(
                        productsData.map(async (product) => {
                            // Tìm số lượng sản phẩm đã bán trong productCountsData
                            const productCount = productCountsData.find(count => count._id === product._id);
                            const count = productCount ? productCount.count : 0;

                            // Lấy đánh giá sao cho sản phẩm
                            const rating = await fetchRating(product._id);

                            return {
                                ...product,
                                count,  // Số lượng đã bán
                                rating, // Đánh giá sao
                            };
                        })
                    );

                    // Sau khi kết hợp dữ liệu, cập nhật state hoặc xử lý tiếp
                    setProducts(updatedProducts); // Giả sử bạn dùng state để lưu trữ sản phẩm

                    console.log('updatedProducts', updatedProducts);

                }
            } catch (error)  {
                message.error('Không thể tải dữ liệu.');
            }
        };

        fetchData();
        fetchCategoryName(categoryId);
    }, [categoryId]);

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

    // hàm lấy tên category theo categoryId
    const fetchCategoryName = async (categoryId) => {
        try {
            const res = await getDetailCategory(categoryId);
            console.log('category', res);
            const name = res.categoryName || 'Chưa có tên danh mục';
            setCategoryName(name); // Cập nhật state với tên danh mục
        } catch (error) {
            console.error('Lỗi khi tải tên danh mục:', error);
            setCategoryName('Chưa có tên danh mục'); // Đặt giá trị mặc định nếu lỗi
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
            const data = { userId, productId, quantity: 1 };
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

    // Hàm xử lý khi nhấn vào nút "Xem thêm"
        const handleViewMore = async (categoryId) => {
            try {
              const res = await getProductByCate(categoryId);
              if (res) {
                navigate("/products", { state: { products: res } });
              }
            } catch (error) {
              message.error("Failed to load product details. Please try again.");
            }
          };

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '280px', backgroundColor: '#f8fbec' }}>
                    <h3 style={{
                        fontSize: '38px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        marginTop: '90px',
                        display: 'flex',
                        padding: '30px 30px',
                        color: '#357D18',
                        fontFamily: 'serif',
                        textTransform: 'uppercase',
                    }}>
                       {categoryName || 'Chưa có tên danh mục'}
                    </h3>

                    <Button
                        type="primary"
                        style={{
                            backgroundColor: '#46852D',
                            color: '#fff',
                            borderRadius: '5px',
                            fontSize: '16px',
                            padding: '10px 30px',
                            border: 'none',
                            marginLeft: 30
                        }}
                        onClick={() => handleViewMore(categoryId)}
                    >
                        Xem thêm < ArrowRightOutlined style={{ marginLeft: '5px' }} />
                    </Button>
                </div>
                <div style={{ flex: '3', overflowX: 'auto', margin: '0 50px' }}>
                    {products.length > 0 ? (
                        <div style={{ display: 'flex' }}>
                            {products.slice(0, 10).map((product) => (            
                                 <div key={product._id} style={{ marginRight: '16px', flexShrink: 0 }}>
                                    <Card
                                        hoverable
                                        style={{ width: '270px', margin: '0 10px' }}
                                        cover={ product?.imageUrl && (
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
                                                                <div style={{ fontSize: '12px' }}>{product.name}</div>
                                                                <div style={{ fontSize: '12px' }}>
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
                                        <p style={{ textAlign: 'center', width: '100%' }}>Không có sản phẩm phổ biến.</p>
                                    )}
                </div>
            </div>
        </div>
    );
};

export default PopularCate;