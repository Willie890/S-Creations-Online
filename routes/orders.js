const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');
const router = express.Router();

// @desc    Get all orders with advanced filtering (Admin only)
// @route   GET /api/orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      from,
      to,
      search,
      customer,
      minAmount,
      maxAmount,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Status filters
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    // Date range filter
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }
    
    // Amount range filter
    if (minAmount || maxAmount) {
      filter.totalAmount = {};
      if (minAmount) filter.totalAmount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.totalAmount.$lte = parseFloat(maxAmount);
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Customer filter
    if (customer) {
      filter.$or = [
        { 'shippingAddress.firstName': { $regex: customer, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: customer, $options: 'i' } },
        { 'shippingAddress.email': { $regex: customer, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    const totalAmount = await Order.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      orders,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        totalItems: total,
        totalAmount: totalAmount[0]?.total || 0
      },
      filters: {
        status,
        paymentStatus,
        dateRange: { from, to },
        search,
        customer
      }
    });
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price description');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    console.error('Order fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// @desc    Update order status (Admin only)
// @route   PATCH /api/orders/:id/status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'On Hold'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(note && { 'notes.admin': note })
      },
      { new: true }
    ).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send email notification for important status changes
    if (order.user.email) {
      try {
        if (status === 'Shipped') {
          await sendEmail(order.user.email, 'orderShipped', order);
        } else if (status === 'Delivered') {
          await sendEmail(order.user.email, 'orderDelivered', order);
        } else if (status === 'Cancelled') {
          await sendEmail(order.user.email, 'orderCancelled', order);
        }
      } catch (emailErr) {
        console.error('Status email failed:', emailErr);
        // Don't fail the request if email fails
      }
    }

    res.json({ 
      message: 'Order status updated successfully', 
      order,
      notification: order.user.email ? 'Email sent to customer' : 'No email sent'
    });
  } catch (err) {
    console.error('Order status update error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// @desc    Update order tracking information (Admin only)
// @route   PATCH /api/orders/:id/tracking
router.patch('/:id/tracking', protect, adminOnly, async (req, res) => {
  try {
    const { trackingNumber, carrier, estimatedDelivery, note } = req.body;

    if (!trackingNumber || !carrier) {
      return res.status(400).json({ error: 'Tracking number and carrier are required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        'shipping.trackingNumber': trackingNumber,
        'shipping.carrier': carrier,
        'shipping.shippedAt': new Date(),
        'shipping.estimatedDelivery': estimatedDelivery ? new Date(estimatedDelivery) : null,
        status: 'Shipped',
        ...(note && { 'notes.admin': note })
      },
      { new: true }
    ).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send shipping confirmation email
    if (order.user.email) {
      try {
        await sendEmail(order.user.email, 'orderShipped', order);
      } catch (emailErr) {
        console.error('Shipping email failed:', emailErr);
      }
    }

    res.json({ 
      message: 'Tracking information updated successfully', 
      order,
      emailSent: !!order.user.email
    });
  } catch (err) {
    console.error('Tracking update error:', err);
    res.status(500).json({ error: 'Failed to update tracking information' });
  }
});

// @desc    Update payment status (Admin only)
// @route   PATCH /api/orders/:id/payment
router.patch('/:id/payment', protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus, transactionId, note } = req.body;
    const validStatuses = ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const updateData = {
      paymentStatus,
      ...(paymentStatus === 'Paid' && { 
        'paymentDetails.paidAt': new Date(),
        'paymentDetails.transactionId': transactionId 
      }),
      ...(note && { 'notes.admin': note })
    };

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      message: 'Payment status updated successfully', 
      order 
    });
  } catch (err) {
    console.error('Payment status update error:', err);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// @desc    Add admin note to order (Admin only)
// @route   PATCH /api/orders/:id/note
router.patch('/:id/note', protect, adminOnly, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({ error: 'Note is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          'notes.admin': {
            note: note.trim(),
            addedBy: req.user.id,
            addedAt: new Date()
          }
        } 
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      message: 'Note added successfully', 
      order 
    });
  } catch (err) {
    console.error('Add note error:', err);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// @desc    Get user's orders
// @route   GET /api/orders/user/my-orders
router.get('/user/my-orders', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (err) {
    console.error('User orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// @desc    Cancel order (User only - if within cancellation period)
// @route   PATCH /api/orders/:id/cancel
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if order can be cancelled (within 1 hour of creation)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (order.createdAt < oneHourAgo) {
      return res.status(400).json({ error: 'Order can only be cancelled within 1 hour of placement' });
    }

    // Check if order is already shipped or delivered
    if (['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order that has already been shipped' });
    }

    order.status = 'Cancelled';
    order.paymentStatus = 'Refunded';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.stock': item.quantity }
      });
    }

    res.json({ 
      message: 'Order cancelled successfully', 
      order 
    });
  } catch (err) {
    console.error('Order cancellation error:', err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// @desc    Get order statistics for dashboard
// @route   GET /api/orders/stats/overview
router.get('/stats/overview', protect, adminOnly, async (req, res) => {
  try {
    const [statusStats, paymentStats, revenueStats, recentActivity] = await Promise.all([
      // Order status statistics
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Payment status statistics
      Order.aggregate([
        {
          $group: {
            _id: '$paymentStatus',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Revenue statistics
      Order.aggregate([
        {
          $match: { paymentStatus: 'Paid' }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            totalOrders: { $sum: 1 }
          }
        }
      ]),
      
      // Recent activity (last 7 days)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      statusStats,
      paymentStats,
      revenueStats: revenueStats[0] || { totalRevenue: 0, averageOrderValue: 0, totalOrders: 0 },
      recentActivity
    });
  } catch (err) {
    console.error('Order stats error:', err);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

module.exports = router;
