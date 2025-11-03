const mongoose = require('mongoose');

// The Category Model stores the names of product categories (e.g., 'Clothing', 'Jewelry').
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
