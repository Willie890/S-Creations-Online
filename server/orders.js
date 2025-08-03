const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const { protect } = require('../middleware/auth')

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user.id
    })

    const savedOrder = await order.save()
    res.status(201).json(savedOrder)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' })
    }

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
