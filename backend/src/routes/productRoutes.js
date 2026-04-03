const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getProductRecommendations } = require('../controllers/productController');

router.route('/').get(getProducts);
router.route('/:id/recommendations').get(getProductRecommendations);
router.route('/:id').get(getProductById);

module.exports = router;
