const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Denormalized items to preserve order history even if product changes
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String, 
    price: Number,
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: { type: String, enum: ['Yoco', 'EFT'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
