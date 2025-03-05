const express = require('express');
const {getTopProducts} = require('../controllers/DMF_SuggestProducts');
const {getHotSellingProducts} = require('../controllers/DMF_HotSelling');

const router = express.Router();

router.get('/top-products/:userId', getTopProducts);

router.get('/hot-selling-products', getHotSellingProducts);



module.exports = router;