const order = require('../models/orderModel');
const product = require('../models/productModel');
const user = require('../models/userModel'); 
const tf = require('@tensorflow/tfjs');

// Tải dữ liệu từ database
async function loadData() {
    try {
        const orders = await order.find();
        const products = await product.find();
        const users = await user.find();
        return { orders, products, users };
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Tạo ma trận người dùng - sản phẩm từ đơn hàng
function createUserProductMatrix(orders, users, products) {
    const matrix = Array(users.length).fill(null).map(() => Array(products.length).fill(0));

    orders.forEach(order => {
        const userIndex = users.findIndex(user => String(user.id) === String(order.userId));
        const productIndex = products.findIndex(product => String(product.id) === String(order.productId));
        
        if (userIndex !== -1 && productIndex !== -1) {
            matrix[userIndex][productIndex] += 1;
        }
    });

    return matrix;
}

// Chuẩn hóa ma trận
function normalizeMatrix(matrix) {
    const maxValue = Math.max(...matrix.flat());
    return matrix.map(row => row.map(value => value / maxValue));
}

// Tiền xử lý dữ liệu
function preprocessData(data) {
    const { orders, users, products } = data;
    const userProductMatrix = createUserProductMatrix(orders, users, products);
    const normalizedMatrix = normalizeMatrix(userProductMatrix);
    return { normalizedMatrix, orders, users, products };
}

// Chia dữ liệu thành tập huấn luyện và kiểm tra
function splitData(matrix) {
    const trainData = [];
    const trainLabels = [];
    const testData = [];
    const testLabels = [];

    matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (Math.random() < 0.8) { 
                trainData.push([rowIndex, colIndex]);
                trainLabels.push(value);
            } else { 
                testData.push([rowIndex, colIndex]);
                testLabels.push(value);
            }
        });
    });

    return { trainData, trainLabels, testData, testLabels };
}

// Xây dựng mô hình Deep Matrix Factorization
function buildModel(numUsers, numProducts) {
    const userInput = tf.input({ shape: [1], dtype: 'int32' });
    const productInput = tf.input({ shape: [1], dtype: 'int32' });

    const userEmbedding = tf.layers.embedding({ inputDim: numUsers, outputDim: 50 }).apply(userInput);
    const productEmbedding = tf.layers.embedding({ inputDim: numProducts, outputDim: 50 }).apply(productInput);

    const userVec = tf.layers.flatten().apply(userEmbedding);
    const productVec = tf.layers.flatten().apply(productEmbedding);

    const concat = tf.layers.concatenate().apply([userVec, productVec]);
    const dense1 = tf.layers.dense({ units: 128, activation: 'relu' }).apply(concat);
    const dense2 = tf.layers.dense({ units: 64, activation: 'relu' }).apply(dense1);
    const output = tf.layers.dense({ units: 1 }).apply(dense2);

    const model = tf.model({ inputs: [userInput, productInput], outputs: output });
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    return model;
}

// Huấn luyện mô hình
async function trainModel(model, data) {
    const { normalizedMatrix } = data;
    const { trainData, trainLabels, testData, testLabels } = splitData(normalizedMatrix);

    const userTrainTensor = tf.tensor1d(trainData.map(d => d[0]), 'int32');
    const productTrainTensor = tf.tensor1d(trainData.map(d => d[1]), 'int32');
    const trainLabelsTensor = tf.tensor1d(trainLabels);

    const userTestTensor = tf.tensor1d(testData.map(d => d[0]), 'int32');
    const productTestTensor = tf.tensor1d(testData.map(d => d[1]), 'int32');
    const testLabelsTensor = tf.tensor1d(testLabels);

    await model.fit([userTrainTensor, productTrainTensor], trainLabelsTensor, {
        epochs: 10,
        batchSize: 32,
        validationData: [[userTestTensor, productTestTensor], testLabelsTensor],
    });

    // Giải phóng bộ nhớ để tránh memory leak
    userTrainTensor.dispose();
    productTrainTensor.dispose();
    trainLabelsTensor.dispose();
    userTestTensor.dispose();
    productTestTensor.dispose();
    testLabelsTensor.dispose();
}


// Dự đoán 10 sản phẩm phù hợp nhất
async function predictTopProducts(userId, model, data) {
    const { products, users } = data;
    
    const userIndex = users.findIndex(user => String(user.id) === String(userId));
    if (userIndex === -1) {
        throw new Error("User not found");
    }

    const userTensor = tf.tensor2d([[userIndex]]); // Chuyển userId thành chỉ số ma trận

    const predictions = await Promise.all(products.map(async (product, productIndex) => {
        const productTensor = tf.tensor2d([[productIndex]]);
        const prediction = model.predict([userTensor, productTensor]);
        const score = (await prediction.data())[0];
        return { product, score };
    }));

    predictions.sort((a, b) => b.score - a.score);
    return predictions.slice(0, 10).map(p => p.product);
}


// Hàm lấy top sản phẩm phổ biến nhất từ đơn hàng nếu user chưa mua
function getPopularProducts(orders, products) {
    const productCount = {};

    // Đếm số lần mỗi sản phẩm được mua
    orders.forEach(order => {
        productCount[order.productId] = (productCount[order.productId] || 0) + 1;
    });

    // Sắp xếp sản phẩm theo số lần mua giảm dần
    return products.sort((a, b) => (productCount[b.id] || 0) - (productCount[a.id] || 0)).slice(0, 10);
}

// API lấy sản phẩm đề xuất cho người dùng
exports.getTopProducts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await loadData();
        const preprocessedData = preprocessData(data);
        const { orders, users, products } = preprocessedData;

        // Kiểm tra nếu user chưa mua hàng
        const userOrders = orders.filter(order => String(order.userId) === String(userId));
        if (userOrders.length === 0) {
            console.log(`User ${userId} chưa có lịch sử mua hàng. Trả về sản phẩm phổ biến nhất.`);
            const topProducts = getPopularProducts(orders, products);
            return res.json(topProducts);
        }

        // Nếu có lịch sử, thực hiện gợi ý bằng mô hình AI
        const model = buildModel(users.length, products.length);
        await trainModel(model, preprocessedData);
        const topProducts = await predictTopProducts(userId, model, preprocessedData);

        res.json(topProducts);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
};

// User mới chưa có lịch sử mua hàng 👉 nhận được top sản phẩm bán chạy nhất.
// User có lịch sử mua hàng 👉 nhận được gợi ý cá nhân hóa từ AI.
// Mỗi user sẽ nhận được 10 sản phẩm gợi ý dựa trên mô hình AI Deep Matrix Factorization.
// Mô hình AI sẽ được huấn luyện trên dữ liệu đơn hàng từ database.