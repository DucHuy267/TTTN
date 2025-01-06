const order = require('../models/orderModel');
const product = require('../models/productModel');
const user = require('../models/userModel'); 
const tf = require('@tensorflow/tfjs');
console.log('TensorFlow.js version:', tf.version.tfjs);

// Tải dữ liệu từ các models
async function loadData() {
    try {
        const orders = await order.findAll();
        const products = await product.findAll();
        const users = await user.findAll();
        return { orders, products, users };
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Tạo ma trận người dùng-sản phẩm từ dữ liệu đơn hàng
function createUserProductMatrix(orders, users, products) {
    const matrix = Array(users.length).fill(null).map(() => Array(products.length).fill(0));

    orders.forEach(order => {
        const userIndex = users.findIndex(user => user.id === order.userId);
        const productIndex = products.findIndex(product => product.id === order.productId);
        
        if (userIndex !== -1 && productIndex !== -1) {
            matrix[userIndex][productIndex] += 1; // Tăng số lượng sản phẩm đã mua
        }
    });

    return matrix;
}

// Thực hiện chuẩn hóa ma trận
function normalizeMatrix(matrix) {
    const normalizedMatrix = matrix.map(row => row.map(value => value / 5)); // Giả sử giá trị tối đa là 5
    return normalizedMatrix;
}

// Tiền xử lý dữ liệu
function preprocessData(data) {
    const { orders, users, products } = data;

    // Tạo ma trận người dùng-sản phẩm
    const userProductMatrix = createUserProductMatrix(orders, users, products);

    // Chuẩn hóa dữ liệu nếu cần thiết
    // Ví dụ: chuẩn hóa giá trị đánh giá về khoảng [0, 1]
    const normalizedMatrix = normalizeMatrix(userProductMatrix);

    return { normalizedMatrix, orders, users, products };
}

// Chia ma trận thành tập huấn luyện và kiểm tra
function splitData(matrix) {
    const trainData = [];
    const trainLabels = [];
    const testData = [];
    const testLabels = [];
    // Logic để chia dữ liệu
    matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (Math.random() < 0.8) { // 80% dữ liệu cho tập huấn luyện
                trainData.push([rowIndex, colIndex]);
                trainLabels.push(value);
            } else { // 20% dữ liệu cho tập kiểm tra
                testData.push([rowIndex, colIndex]);
                testLabels.push(value);
            }
        });
    });
    return { trainData, trainLabels, testData, testLabels };
}

// Xây dựng mô hình Deep Matrix Factorization
function buildModel(numUsers, numProducts) {
    const userInput = tf.input({ shape: [1], name: 'user' });
    const productInput = tf.input({ shape: [1], name: 'product' });

    const userEmbedding = tf.layers.embedding({ inputDim: numUsers, outputDim: 50 })(userInput);
    const productEmbedding = tf.layers.embedding({ inputDim: numProducts, outputDim: 50 })(productInput);

    const userVec = tf.layers.flatten()(userEmbedding);
    const productVec = tf.layers.flatten()(productEmbedding);

    const concat = tf.layers.concatenate()([userVec, productVec]);
    const dense1 = tf.layers.dense({ units: 128, activation: 'relu' })(concat);
    const dense2 = tf.layers.dense({ units: 64, activation: 'relu' })(dense1);
    const output = tf.layers.dense({ units: 1 })(dense2);

    const model = tf.model({ inputs: [userInput, productInput], outputs: output });
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    return model;
}

// Huấn luyện mô hình
async function trainModel(model, data) {
    const { normalizedMatrix } = data;

    // Chia dữ liệu thành tập huấn luyện và kiểm tra
    const { trainData, trainLabels, testData, testLabels } = splitData(normalizedMatrix);

    // Huấn luyện mô hình
    await model.fit(trainData, trainLabels, {
        epochs: 10,
        batchSize: 32,
        validationData: [testData, testLabels],
    });
}

// Dự đoán 10 sản phẩm phù hợp nhất cho một người dùng
async function predictTopProducts(userId, model, data) {
    const { products } = data;
    const userTensor = tf.tensor1d([userId]);

    const predictions = await Promise.all(products.map(async (product) => {
        const productTensor = tf.tensor1d([product.id]);
        const prediction = tf.tidy(() => model.predict([userTensor, productTensor]));
        return { product, score: prediction.dataSync()[0] };
    }));

    predictions.sort((a, b) => b.score - a.score);
    return predictions.slice(0, 10).map(p => p.product);
}

// Lấy 10 sản phẩm được dự đoán phù hợp nhất cho một người dùng
exports.getTopProducts= async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await loadData();
        const preprocessedData = preprocessData(data);
        const model = buildModel(data.users.length, data.products.length);
        await trainModel(model, preprocessedData);
        const topProducts = await predictTopProducts(userId, model, preprocessedData);
        res.json(topProducts);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
} 

