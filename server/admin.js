const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const Order = require('../models/Order')
const User = require('../models/User')
const { protect, admin } = require('../middleware/auth')

// Get dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
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
    ])

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Product management
router.route('/products')
  .get(protect, admin, async (req, res) => {
    try {
      const products = await Product.find()
      res.json(products)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  .post(protect, admin, async (req, res) => {
    try {
      const product = new Product(req.body)
      const savedProduct = await product.save()
      res.status(201).json(savedProduct)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

router.route('/products/:id')
  .put(protect, admin, async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      res.json(product)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  .delete(protect, admin, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id)
      res.json({ message: 'Product removed' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// Order management
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/orders/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
