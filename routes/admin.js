const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    // Get current date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      todayRevenue,
      todayOrders,
      monthlyRevenue,
      yearlyRevenue,
      recentOrders
    ] = await Promise.all([
      // Total revenue (all paid orders)
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Total orders count
      Order.countDocuments(),
      
      // Active products count
      Product.countDocuments({ status: 'active' }),
      
      // Total customers count
      User.countDocuments({ role: 'user' }),
      
      // Today's revenue
      Order.aggregate([
        { 
          $match: { 
            paymentStatus: 'Paid',
            createdAt: { $gte: today }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Today's orders count
      Order.countDocuments({ createdAt: { $gte: today } }),
      
      // This month's revenue
      Order.aggregate([
        { 
          $match: { 
            paymentStatus: 'Paid',
            createdAt: { $gte: thisMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // This year's revenue
      Order.aggregate([
        { 
          $match: { 
            paymentStatus: 'Paid',
            createdAt: { $gte: thisYear }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Recent orders (last 5)
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .populate('items.product', 'name')
    ]);

    // Calculate order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate payment status distribution
    const paymentStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      // Main stats
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      
      // Today's stats
      todayRevenue: todayRevenue[0]?.total || 0,
      todayOrders,
      
      // Period stats
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      yearlyRevenue: yearlyRevenue[0]?.total || 0,
      
      // Recent data
      recentOrders,
      
      // Distribution stats
      orderStatusStats,
      paymentStatusStats
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to load dashboard statistics' });
  }
});

// @desc    Get analytics data with charts
// @route   GET /api/admin/analytics
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    let dateRange = {};
    let groupFormat = {};

    // Set date range and grouping based on period
    const now = new Date();
    switch (period) {
      case 'weekly':
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateRange = { createdAt: { $gte: lastWeek } };
        groupFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'yearly':
        dateRange = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default: // monthly
        dateRange = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1) } };
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
    }

    // Sales data for charts
    const salesData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
          ...dateRange
        }
      },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    ]);

    // Customer analytics
    const customerStats = await Order.aggregate([
      {
        $match: { paymentStatus: 'Paid' }
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          averageOrderValue: { $avg: '$totalSpent' },
          averageOrdersPerCustomer: { $avg: '$orderCount' }
        }
      }
    ]);

    // Inventory alerts (low stock)
    const lowStockProducts = await Product.find({
      'inventory.trackQuantity': true,
      'inventory.stock': { $lt: 10 }
    }).select('name inventory images').limit(10);

    res.json({
      salesData,
      topProducts: topProducts.map(item => ({
        product: item.product[0],
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue
      })),
      customerStats: customerStats[0] || {
        totalCustomers: 0,
        averageOrderValue: 0,
        averageOrdersPerCustomer: 0
      },
      lowStockProducts,
      summary: {
        totalRevenue: salesData.reduce((acc, curr) => acc + curr.totalRevenue, 0),
        totalOrders: salesData.reduce((acc, curr) => acc + curr.orderCount, 0),
        period: period
      }
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to load analytics data' });
  }
});

// @desc    Get sales report
// @route   GET /api/admin/sales-report
router.get('/sales-report', protect, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let dateMatch = {};
    if (startDate && endDate) {
      dateMatch.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }

    let groupFormat = {};
    switch (groupBy) {
      case 'week':
        groupFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'month':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default: // day
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const salesReport = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
          ...dateMatch
        }
      },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          totalItems: { $sum: { $size: '$items' } },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);

    res.json({
      report: salesReport,
      parameters: {
        startDate,
        endDate,
        groupBy
      }
    });
  } catch (err) {
    console.error('Sales report error:', err);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
});

// @desc    Update website design settings
// @route   PUT /api/admin/design
router.put('/design', protect, adminOnly, async (req, res) => {
  try {
    const designSettings = req.body;
    
    // Validate design settings
    const validColors = designSettings.colors && 
                       designSettings.colors.primary && 
                       designSettings.colors.secondary && 
                       designSettings.colors.accent;
    
    if (!validColors) {
      return res.status(400).json({ error: 'Invalid color configuration' });
    }

    // In a production environment, you would save this to a database
    // For now, we'll simulate saving and return success
    
    // Example: Save to a DesignSettings model
    // await DesignSettings.findOneAndUpdate({}, designSettings, { upsert: true, new: true });
    
    console.log('Design settings updated:', designSettings);
    
    res.json({ 
      message: 'Design settings updated successfully', 
      settings: designSettings,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Design update error:', err);
    res.status(500).json({ error: 'Failed to update design settings' });
  }
});

// @desc    Get website design settings
// @route   GET /api/admin/design
router.get('/design', protect, adminOnly, async (req, res) => {
  try {
    // In production, retrieve from database
    // const settings = await DesignSettings.findOne();
    
    // Return default settings for now
    const defaultDesign = {
      colors: {
        primary: '#6a5acd',
        secondary: '#ff6b6b', 
        accent: '#4ecdc4',
        background: '#ffffff',
        text: '#1a1a1a',
        border: '#e0e0e0'
      },
      layout: {
        showFeatured: true,
        showCategories: true,
        showPromo: true,
        showTestimonials: true,
        heroStyle: 'split', // 'split', 'full', 'minimal'
        navigationStyle: 'standard' // 'standard', 'minimal', 'creative'
      },
      typography: {
        headingFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif',
        baseSize: '16px'
      },
      components: {
        productCardStyle: 'standard', // 'standard', 'minimal', 'creative'
        buttonStyle: 'rounded', // 'rounded', 'square', 'outline'
        animationLevel: 'standard' // 'minimal', 'standard', 'high'
      }
    };
    
    res.json(defaultDesign);
  } catch (err) {
    console.error('Design fetch error:', err);
    res.status(500).json({ error: 'Failed to load design settings' });
  }
});

// @desc    Get system status and health
// @route   GET /api/admin/system-status
router.get('/system-status', protect, adminOnly, async (req, res) => {
  try {
    const [dbStatus, memoryUsage, uptime] = await Promise.all([
      // Database status
      mongoose.connection.db.admin().ping(),
      
      // System memory usage
      Promise.resolve(process.memoryUsage()),
      
      // Server uptime
      Promise.resolve(process.uptime())
    ]);

    const status = {
      database: dbStatus.ok === 1 ? 'healthy' : 'unhealthy',
      server: 'healthy',
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      uptime: Math.round(uptime),
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };

    res.json(status);
  } catch (err) {
    console.error('System status error:', err);
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

module.exports = router;
