const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  // Storing category name as a string for simplicity with the Product/Category relationship
  category: { type: String, required: true }, 
  image: String,
  badge: String // e.g., 'New', 'Sale', 'Limited Edition'
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
