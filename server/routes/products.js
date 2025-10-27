const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// @desc    Create product (admin only)
// @route   POST /api/products
router.post('/', protect, adminOnly, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

module.exports = router;
