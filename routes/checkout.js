const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { sendEmail } = require('../utils/emailService');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Create order from cart
// @route   POST /api/checkout
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, billingAddress } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const shippingCost = subtotal > 75 ? 0 : 10; // Free shipping over $75
    const taxAmount = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + shippingCost + taxAmount;

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      variant: item.variant
    }));

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      subtotal,
      shippingCost,
      taxAmount,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod
    });

    await order.save();
    await order.populate('user', 'name email');

    // Clear cart
    cart.items = [];
    await cart.save();

    // Send confirmation email
    try {
      await sendEmail(req.user.email, 'orderConfirmation', order);
    } catch (emailErr) {
      console.error('Order confirmation email failed:', emailErr);
    }

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// @desc    Get payment options
// @route   GET /api/checkout/payment-options
router.get('/payment-options', (req, res) => {
  res.json({
    yoco: {
      enabled: true,
      publicKey: process.env.YOCO_PUBLIC_KEY
    },
    eft: {
      enabled: true,
      instructions: `Please EFT the total amount to:
Bank: ${process.env.BUSINESS_BANK_NAME}
Account Holder: ${process.env.BUSINESS_ACCOUNT_HOLDER}
Account Number: ${process.env.BUSINESS_ACCOUNT_NUMBER}
Reference: Your Order ID`
    }
  });
});

module.exports = router;
