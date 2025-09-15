const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', async (req, res, next) => {
  try {
    const [totalSales, totalOrders, totalProducts, totalCustomers, recentOrders] = await Promise.all([
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalSales: totalSales[0]?.total || 0,
        totalOrders,
        totalProducts,
        totalCustomers,
        recentOrders
      }
    });
  } catch (err) {
    next(err);
  }
});

router.route('/products')
  .get(async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Product.countDocuments()
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
  })
  .post(async (req, res, next) => {
    try {
      const product = new Product(req.body);
      const savedProduct = await product.save();
      
      res.status(201).json({
        status: 'success',
        product: savedProduct
      });
    } catch (err) {
      next(err);
    }
  });

router.route('/products/:id')
  .get(async (req, res, next) => {
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
  })
  .put(async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
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
  })
  .delete(async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        return next(new AppError('Product not found', 404));
      }

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (err) {
      next(err);
    }
  });

router.get('/orders', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .populate('items.product', 'name price'),
      Order.countDocuments()
    ]);

    res.status(200).json({
      status: 'success',
      results: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      orders
    });
  } catch (err) {
    next(err);
  }
});

router.put('/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    )
    .populate('user', 'name email')
    .populate('items.product', 'name price');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      status: 'success',
      order
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
