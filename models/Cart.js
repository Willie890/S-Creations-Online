const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: {
      name: String,
      option: String
    }
  }],
  coupon: {
    code: String,
    discount: Number
  }
}, { 
  timestamps: true 
});

// Calculate total price virtual
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
