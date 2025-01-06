import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Input, Rate, Button, Image } from 'antd';
import './Comments.css'; // Import the CSS file
import { Span } from '../../components/HeaderComponents/style';

const desc = ['Rất tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];

const Comments = ({ productId, userId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/comments/getCommentsByProductId/${productId}`);
                const comments = response.data.data.comments; // Ensure this matches the API response structure
                const formattedComments = comments.map(comment => ({
                    _id: comment._id,
                    nameUser: comment.userId.name,
                    productName: comment.productId.name,
                    comment: comment.comment,
                    rating: comment.rating,
                    createdAt: comment.createdAt,
                    images: Array.isArray(comment.images) ? comment.images : [] // Ensure images is an array
                }));
                console.log('formattedComments:', formattedComments);
                setComments(formattedComments);
            } catch (err) {
                console.error('Failed to fetch comments:', err);
            }
        };

        fetchComments();
    }, [productId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };
    
    // commnets
    const handleCommentSubmit = async () => {
        if (newComment.trim() && rating > 0) {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('userId', userId);
            formData.append('comment', newComment);
            formData.append('rating', rating);
            selectedImages.forEach((image, index) => {
                formData.append('images', image);
            });
    
            // Log the contents of the FormData
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            try {
                const response = await axios.post('http://localhost:4000/comments', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setComments([...comments, response.data.data.comment]);
                setNewComment('');
                setRating(0);
                setSelectedImages([]);
                setIsModalVisible(false);
            } catch (err) {
                console.error('Failed to submit comment:', err);
            }
        }
    };
    
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + selectedImages.length > 5) {
            alert('You can only upload up to 5 images.');
            return;
        }
        setSelectedImages(prevImages => [...prevImages, ...files]);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedImages([]); // Reset the selected images when the modal is closed
    };

    return (
        <div className="comments-container">
            <div style={{ background: '#f9f9f9', padding: '20px', marginBottom: '20px' }}>
                <div>
                    <p style={{ fontWeight: 'bold', fontSize: '20px', color:'#000'}}>Đánh giá</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '25%' }}>
                        <Span style={{color: '#000',}}>Đánh giá trung bình</Span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '80px', color:'#000'}} >
                                {comments.length > 0 ? (comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length).toFixed(1) : 0}
                            </span>
                            <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
                                <Rate disabled allowHalf value={comments.length > 0 ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length : 1} />
                            </div>
                            <Span style={{color: '#000',}}>{comments.length} nhận xét</Span>
                        </div>
                    </div>

                    <div style={{ width: '40%', margin: '0 20px' }}>
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <p style={{ width: '50px', margin: '0', color:'#000' }}>{star} sao</p>
                                <div style={{ width:'300px', background: '#e0e0e0', margin: '0 10px', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(comments.filter(comment => comment.rating === star).length / comments.length) * 100}%`,
                                        background: '#1890ff',
                                        height: '100%'
                                    }}></div>
                                </div>
                                <p style={{ width: '30px', margin: '0', color:'#000' }}>{comments.filter(comment => comment.rating === star).length}</p>
                                {star ? <Span style={{color: '#000',}} >{desc[star - 1]}</Span> : ''}
                            </div>
                        ))}
                    </div>

                    <div style={{ width: '35%',  display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
                        <Span style={{marginBottom: 20, color:'#000' }}>Chia sẻ nhận xét của bạn về sản phẩm này </Span>
                        <Button type="primary" onClick={showModal} style={{ width: '200px', height: '50px' }}>
                            Viết bình luận
                        </Button>
                        <Modal
                            title="Viết đánh giá"
                            visible={isModalVisible}
                            onOk={handleCommentSubmit}
                            onCancel={handleCancel}
                            okText="Gửi"
                            cancelText="Hủy"
                        >
                            <Span style={{color: '#000',}}>Đánh giá sản phẩm này *</Span><br />
                            <Rate value={rating} onChange={handleRatingChange}
                            style={{marginLeft: 45, marginBottom: 30, fontSize: 30,  transform: 'scale(2)', transformOrigin: 'center'}} />
                            <Input.TextArea
                                value={newComment}
                                onChange={handleCommentChange}
                                placeholder="Viết đánh giá..."
                                rows={4}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                style={{ marginTop: 20 }}
                            />
                            {selectedImages.length > 0 && (
                                <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {selectedImages.map((image, index) => (
                                        <img key={index} src={URL.createObjectURL(image)} alt={`Selected ${index}`} style={{ maxWidth: '20%' }} />
                                    ))}
                                </div>
                            )}
                        </Modal>
                    </div>
                </div>
            </div>
            <div style={{ background: '#f9f9f9', padding: '20px', marginBottom: '20px' }}>
                <Span style={{color: '#000',}}>{comments.length} bình luận cho sản phẩm này</Span>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Rate disabled value={comment.rating} />
                                    <p style={{marginLeft: 10}}><strong>{comment.nameUser || 'Người dùng ẩn danh'}</strong></p>
                                </div>
                                <p style={{ textAlign: 'right' }}>
                                    {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <p style={{margin:'0 10px'}}>{comment.comment}</p>
                            {comment.images && comment.images.length > 0 && (
                                <Image.PreviewGroup>
                                    {comment.images.map((image, index) => (
                                        <Image key={index} width={80} src={`http://localhost:4000/${image}`} alt={`Comment ${index}`} />
                                    ))}
                                </Image.PreviewGroup>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Comments;