const express = require('express');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const sort = req.query.sort || '-createdAt';

    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      product
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
