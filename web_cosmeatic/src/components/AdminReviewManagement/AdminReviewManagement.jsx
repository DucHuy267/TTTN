import React, { useEffect, useState } from "react";
import { Table, Select, Rate, Input, Image, message } from "antd";
import axios from "axios";

const { Option } = Select;
const { Search } = Input;

const AdminReviewManagement = () => {
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);

    useEffect(() => {
        fetchComments();
        fetchProducts();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await axios.get("http://localhost:4000/comments");
            setComments(res.data.data.comments);
            setFilteredComments(res.data.data.comments);
        } catch (err) {
            message.error("Không thể tải đánh giá");
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:4000/products/getAll");
            setProducts(res.data);
        } catch (err) {
            message.error("Không thể tải sản phẩm");
        }
    };

    const handleFilter = () => {
        const filtered = comments.filter(comment => {
            const matchProduct = !selectedProduct || comment.productId === selectedProduct;
            const matchRating = !selectedRating || comment.rating === selectedRating;
            return matchProduct && matchRating;
        });
        setFilteredComments(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [selectedProduct, selectedRating]);

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "productId",
            render: (id) => {
                const product = products.find(p => p._id === id);
                return product ? product.name : "N/A";
            },
        },
        {
            title: "Người dùng",
            dataIndex: "userId",
            render: (user) => user?.name || "N/A",
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            render: (rating) => <Rate disabled defaultValue={rating} />,
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: "Bình luận",
            dataIndex: "comment",
        },
        // {
        //     title: "Hình ảnh",
        //     dataIndex: "images",
        //     render: (images) =>
        //         images?.length ? images.map((img, index) => (
        //             <Image key={index} src={img} width={50} height={50} style={{ marginRight: 5 }} />
        //         )) : "Không có",
        // },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Quản lý đánh giá</h2>

            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <Select
                    placeholder="Chọn sản phẩm"
                    allowClear
                    style={{ width: 250 }}
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) => setSelectedProduct(value)}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {products.map((product) => (
                        <Option key={product._id} value={product._id}>
                            {product.name}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Chọn số sao"
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => setSelectedRating(value)}
                >
                    {[5, 4, 3, 2, 1].map((star) => (
                        <Option key={star} value={star}>
                            {star} sao
                        </Option>
                    ))}
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={filteredComments.map((c, index) => ({ ...c, key: index }))}
                bordered
            />
        </div>
    );
};

export default AdminReviewManagement;

// thêm phản hồi từ admin