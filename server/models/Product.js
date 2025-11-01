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

// @desc    Get product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// @desc    Create product (admin only)
// @route   POST /api/products
router.post('/', protect, adminOnly, async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid product data' });
  }
});

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ message: 'Product removed' });
});

// @desc    Get all categories (for admin.html list)
// @route   GET /api/products/categories
router.get('/categories', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc    Add a category (placeholder for admin.html)
// @route   POST /api/products/categories
router.post('/categories', protect, adminOnly, (req, res) => {
  res.status(201).json({ message: `Category ${req.body.name} acknowledged.` });
});


module.exports = router;
