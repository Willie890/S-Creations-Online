const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order'); // NEW: Requires the new Order model
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Get payment options (UNMODIFIED)
// @route   GET /api/checkout/payment-options
router.get('/payment-options', (req, res) => {
  res.json({
    yoco: {
      enabled: true,
      publicKey: process.env.YOCO_PUBLIC_KEY,
      checkoutUrl: 'https://checkout.yoco.com/checkout'
    },
    eft: {
      enabled: true,
      instructions: `
        Please EFT the total amount to:
        Bank: ${process.env.BUSINESS_BANK_NAME}
        Account Holder: ${process.env.BUSINESS_ACCOUNT_HOLDER}
        Account Number: ${process.env.BUSINESS_ACCOUNT_NUMBER}
        Reference: [Your Order ID]
      `.trim()
    },
    contactEmail: process.env.BUSINESS_EMAIL
  });
});

// @desc    Create a new order from the user's cart
// @route   POST /api/checkout
router.post('/', protect, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  
  // 1. Find the user's cart and populate product details
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty. Cannot create an order.' });
  }

  // 2. Calculate total amount
  const totalAmount = cart.items.reduce((acc, item) => {
    if (!item.product || !item.product.price) {
      // Use a custom error handler or log this for detailed debugging
      throw new Error(`Product data missing for item: ${item.product ? item.product._id : 'Unknown'}`);
    }
    return acc + item.product.price * item.quantity;
  }, 0);

  // 3. Prepare order items (denormalizing product data for history)
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));
  
  // 4. Create the new order
  const order = new Order({
    user: req.user.id,
    items: orderItems,
    totalAmount: totalAmount,
    shippingAddress: shippingAddress,
    paymentMethod: paymentMethod,
    paymentStatus: 'Pending', // Default status
  });

  try {
    await order.save();
    
    // 5. Clear the cart after successful order creation
    cart.items = [];
    await cart.save();
    
    // 6. Respond with the new order details
    res.status(201).json({ 
      message: 'Order created successfully!',
      orderId: order._id,
      totalAmount: order.totalAmount,
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Could not create order.' });
  }
});

module.exports = router;
