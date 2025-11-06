const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images inventory');

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.inventory.trackQuantity && product.inventory.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check stock again after update
      if (product.inventory.trackQuantity && 
          cart.items[existingItemIndex].quantity > product.inventory.stock) {
        return res.status(400).json({ error: 'Insufficient stock for updated quantity' });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        variant: variant || {}
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images inventory');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// @desc    Update cart item quantity
// @route   PATCH /api/cart/:productId
router.patch('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, variant } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a non-negative number' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find item index
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant || {})
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // Check stock if increasing quantity
    if (quantity > cart.items[itemIndex].quantity) {
      const product = await Product.findById(productId);
      if (product.inventory.trackQuantity && quantity > product.inventory.stock) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
    }

    if (quantity === 0) {
      // Remove item if quantity is zero
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images inventory');

    res.json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { variant } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    
    // Filter out the item to remove
    cart.items = cart.items.filter(item => 
      !(item.product.toString() === productId && 
        JSON.stringify(item.variant) === JSON.stringify(variant || {}))
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images inventory');

    res.json({
      message: 'Item removed from cart',
      cart
    });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
router.delete('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
router.post('/coupon', protect, async (req, res) => {
  try {
    const { code } = req.body;

    // Basic coupon validation (extend this with a Coupon model in production)
    const validCoupons = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'FREESHIP': { discount: 0, type: 'shipping', minAmount: 50 },
      'SAVE20': { discount: 20, type: 'percentage', minAmount: 100 }
    };

    const coupon = validCoupons[code];
    if (!coupon) {
      return res.status(400).json({ error: 'Invalid coupon code' });
    }

    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'price');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Check minimum amount if required
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    if (coupon.minAmount && subtotal < coupon.minAmount) {
      return res.status(400).json({ 
        error: `Coupon requires minimum purchase of $${coupon.minAmount}` 
      });
    }

    cart.coupon = {
      code,
      discount: coupon.discount,
      type: coupon.type
    };

    await cart.save();
    await cart.populate('items.product', 'name price images inventory');

    res.json({
      message: 'Coupon applied successfully',
      cart
    });
  } catch (err) {
    console.error('Apply coupon error:', err);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
router.delete('/coupon', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.coupon = null;
    await cart.save();
    await cart.populate('items.product', 'name price images inventory');

    res.json({
      message: 'Coupon removed successfully',
      cart
    });
  } catch (err) {
    console.error('Remove coupon error:', err);
    res.status(500).json({ error: 'Failed to remove coupon' });
  }
});

module.exports = router;
