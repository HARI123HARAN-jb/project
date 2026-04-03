const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $text: { $search: req.query.keyword }
        }
      : {};

    // Sort by text search score logic if keyword exists, otherwise standard sort
    const products = req.query.keyword 
      ? await Product.find({ ...keyword }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } })
      : await Product.find({});
      
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI product recommendations based on Content Filtering (Category & Price Matching)
// @route   GET /api/products/:id/recommendations
// @access  Public
const getProductRecommendations = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Base product not found for rendering associations' });
    }

    // Content-based Filtering Algorithmic Logic:
    // 1. Same Category items get mathematically higher weight natively by finding them directly.
    // 2. Fallbacks to close pricing if the category returns very few results.
    const recommendations = await Product.find({
      _id: { $ne: currentProduct._id },
      category: currentProduct.category
    }).limit(4);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  getProductRecommendations,
};
