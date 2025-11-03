const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  // Linked to Category Model
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  subCategory: String, // Use for finer filtering
  image: String,
  badge: String, // e.g., 'New', 'Sale'
  
  // Admin Customization Fields
  displayOrder: { type: Number, default: 999 }, // For custom sorting
  isFeatured: { type: Boolean, default: false }, // For main page highlights
  isSlideshow: { type: Boolean, default: false }, // For carousel display
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
