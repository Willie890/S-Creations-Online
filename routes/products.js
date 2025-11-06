const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      status = 'active',
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = { status };
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'seo.title': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        current: Number(page),
        total: totalPages,
        count: products.length,
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// @desc    Get product by ID or slug
// @route   GET /api/products/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const product = await Product.findOne({
      $or: [
        { _id: identifier },
        { 'seo.slug': identifier }
      ]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
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
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Product with this SKU or slug already exists' });
    }
    res.status(400).json({ error: 'Invalid product data' });
  }
});

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid product data' });
  }
});

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product archived successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// @desc    Get all categories
// @route   GET /api/products/categories/all
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
