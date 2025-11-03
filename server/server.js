require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- CRITICAL FIX: FORCE MODEL LOADING AFTER DB CONNECTION ---
// This ensures Mongoose registers the models before routes try to use them.
connectDB();
require('./models/User'); 
require('./models/Product');
require('./models/Cart');
require('./models/Category'); // New Model
require('./models/Order');    // New Model

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin'); // New Admin Route

// Import middleware
const { protect } = require('./middleware/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', protect, checkoutRoutes);
app.use('/api/cart', protect, cartRoutes);
app.use('/api/admin', protect, adminRoutes); // Protected admin route

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
