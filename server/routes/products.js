const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category'); 
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// --- PRODUCT ROUTES ---

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Create product (admin only)
// @route   POST /api/products
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- CATEGORY ROUTES (Admin CRUD) ---

// @desc    Get all categories
// @route   GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Create a new category (admin only)
// @route   POST /api/products/categories
router.post('/categories', protect, adminOnly, async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ msg: 'Category name is required' });
  }

  try {
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
