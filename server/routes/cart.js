const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get cart
router.get('/', protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
    await cart.save();
  }
  res.json(cart);
});

// Add to cart
router.post('/', protect, async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    item.quantity += 1;
  } else {
    cart.items.push({ product: productId, quantity: 1 });
  }

  await cart.save();
  res.json({ success: true });
});

module.exports = router;
