const multer = require('multer');
const Comment = require('../models/commentModel');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Specify the file name
    }
});

const upload = multer({ storage: storage }).array('images', 5); // Allow up to 5 images

// Tạo một bình luận mới
exports.createComment = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: 'thất bại',
                message: err.message
            });
        }

        try {
            const { userId, productId } = req.body;

            // 🔍 Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
            const existingComment = await Comment.findOne({ userId, productId });
            if (existingComment) {
                return res.status(400).json({
                    status: 'thất bại',
                    message: 'Bạn đã đánh giá sản phẩm này rồi.'
                });
            }

            const imagePaths = req.files.map(file => file.path);
            const commentData = {
                ...req.body,
                images: imagePaths
            };

            const comment = await Comment.create(commentData);

            res.status(201).json({
                status: 'thành công',
                data: {
                    comment
                }
            });

        } catch (err) {
            res.status(400).json({
                status: 'thất bại',
                message: err.message
            });
        }
    });
};

// Lấy tất cả các bình luận
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            // .populate({
            //     path: 'productId',
            //     select: 'name'
            // })
            .populate({
                path: 'userId',
                select: 'name'
            });

        res.status(200).json({
            status: 'thành công',
            results: comments.length,
            data: {
                comments
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'thất bại',
            message: err.message
        });
    }
};


// Lấy tất cả các bình luận theo productId
exports.getCommentsByProductId = async (req, res) => {
    try {
        const comments = await Comment.find({ productId: req.params.productId })
            .populate('userId', 'name') // Populate userId with the user's name
            .populate('productId', 'name'); // Populate productId with the product's name
        res.status(200).json({
            success: true,
            results: comments.length,
            data: {
                comments
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Lấy tất cả các bình luận theo userId
exports.getCommentsByUserId = async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.params.userId });
        res.status(200).json({
            status: 'thành công',
            results: comments.length,
            data: {
                comments
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'thất bại',
            message: err.message
        });
    }
};

// Lấy một bình luận theo ID
exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({
                status: 'thất bại',
                message: 'Không tìm thấy bình luận với ID đó'
            });
        }
        res.status(200).json({
            status: 'thành công',
            data: {
                comment
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'thất bại',
            message: err.message
        });
    }
};

// Cập nhật một bình luận theo ID
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!comment) {
            return res.status(404).json({
                status: 'thất bại',
                message: 'Không tìm thấy bình luận với ID đó'
            });
        }
        res.status(200).json({
            status: 'thành công',
            data: {
                comment
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'thất bại',
            message: err.message
        });
    }
};

// Xóa một bình luận theo ID
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({
                status: 'thất bại',
                message: 'Không tìm thấy bình luận với ID đó'
            });
        }
        res.status(204).json({
            status: 'thành công',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'thất bại',
            message: err.message
        });
    }
};

// Đánh giá trung bình của sản phẩm
exports.getAverageRating = async (req, res) => {
    try {
        const stats = await Comment.aggregate([
            {
                $match: { productId: req.params.productId }
            },
            {
                $group: {
                    _id: '$productId',
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.status(404).json({
                status: 'thất bại',
                message: 'Không tìm thấy đánh giá cho sản phẩm này'
            });
        }

        res.status(200).json({
            status: 'thành công',
            data: {
                productId: req.params.productId,
                avgRating: stats[0].avgRating
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'thất bại',
            message: err.message
        });
    }
};
