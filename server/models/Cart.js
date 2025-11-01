const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get cart (UNMODIFIED)
router.get('/', protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
    await cart.save();
  }
  res.json(cart);
});

// Add to cart (MODIFIED: Allows setting initial quantity)
router.post('/', protect, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity: quantity });
  }

  await cart.save();
  res.json({ success: true, cart });
});

// @desc    Update cart item quantity
// @route   PATCH /api/cart/:productId
router.patch('/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  
  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a non-negative number' });
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Product not in cart' });
  }
  
  if (quantity === 0) {
    // Remove item if quantity is zero
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  cart = await cart.populate('items.product'); // Send full details back
  res.json(cart);
});


// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
router.delete('/:productId', protect, async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  
  if (cart.items.length === initialLength) {
    return res.status(404).json({ error: 'Product not in cart' });
  }

  await cart.save();
  cart = await cart.populate('items.product'); // Send full details back
  res.json(cart);
});

module.exports = router;
