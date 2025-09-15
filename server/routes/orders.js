const express = require('express');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, async (req, res, next) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user.id
    });

    const savedOrder = await order.save();
    await savedOrder.populate('user', 'name email');
    await savedOrder.populate('items.product', 'name price images');

    res.status(201).json({
      status: 'success',
      order: savedOrder
    });
  } catch (err) {
    next(err);
  }
});

router.get('/myorders', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name price images'),
      Order.countDocuments({ user: req.user.id })
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

router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price images');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to view this order', 403));
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
