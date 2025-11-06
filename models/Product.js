const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  category: { type: String, required: true },
  subcategory: { type: String },
  tags: [{ type: String }],
  images: [{ 
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  inventory: {
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    trackQuantity: { type: Boolean, default: true }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  seo: {
    title: String,
    description: String,
    slug: { type: String, unique: true }
  },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  featured: { type: Boolean, default: false },
  badge: { type: String, enum: ['new', 'sale', 'bestseller', 'limited'], default: null },
  variants: [{
    name: String,
    options: [{
      name: String,
      price: Number,
      stock: Number
    }]
  }]
}, { 
  timestamps: true 
});

// Auto-generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.seo.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
