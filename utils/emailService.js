const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter configuration error:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

// Email templates with enhanced styling
const emailTemplates = {
  // Welcome email for new users
  welcome: (user) => ({
    subject: `Welcome to S-Creations, ${user.name}! 🎨`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #6a5acd, #4ecdc4); padding: 40px 20px; text-align: center; color: white; }
          .content { padding: 40px; }
          .button { display: inline-block; background: #6a5acd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
          .feature { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
          .footer { background: #1a1a1a; color: white; padding: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 2.5rem;">🎨 S-Creations</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Where Fashion Meets Art</p>
          </div>
          
          <div class="content">
            <h2>Welcome to Our Creative Community, ${user.name}! ✨</h2>
            <p>We're thrilled to have you join S-Creations. Your account has been successfully created and you're now part of our creative family.</p>
            
            <div class="features">
              <div class="feature">
                <h3>🛍️ Exclusive Access</h3>
                <p>Be the first to discover new collections and limited editions</p>
              </div>
              <div class="feature">
                <h3>🎨 Creative Inspiration</h3>
                <p>Get inspired by artist stories and behind-the-scenes content</p>
              </div>
              <div class="feature">
                <h3>🚚 Free Shipping</h3>
                <p>Enjoy free shipping on orders over $75</p>
              </div>
              <div class="feature">
                <h3>💝 Member Rewards</h3>
                <p>Earn points with every purchase and unlock special rewards</p>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}" class="button">Start Exploring</a>
            </div>
            
            <p><strong>Ready to get creative?</strong> Browse our collections and discover unique pieces that tell a story.</p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px;">S-Creations - Where Fashion Meets Art</p>
            <p style="margin: 0; opacity: 0.7; font-size: 0.9rem;">
              123 Creative Street, Art District, NY 10001<br>
              <a href="mailto:hello@s-creations.com" style="color: #4ecdc4;">hello@s-creations.com</a> | 
              <a href="${process.env.FRONTEND_URL}" style="color: #4ecdc4;">Visit Website</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Order confirmation email
  orderConfirmation: (order) => ({
    subject: `Order Confirmation - ${order.orderNumber} ✅`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #10b981, #4ecdc4); padding: 30px 20px; text-align: center; color: white; }
          .content { padding: 30px; }
          .order-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .order-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
          .order-total { display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem; padding-top: 10px; }
          .button { display: inline-block; background: #6a5acd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Order Confirmed! 🎉</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Thank you for your purchase</p>
          </div>
          
          <div class="content">
            <h2>Hello ${order.shippingAddress?.firstName || 'Valued Customer'},</h2>
            <p>Your order <strong>${order.orderNumber}</strong> has been confirmed and is being processed.</p>
            
            <div class="order-summary">
              <h3 style="margin-top: 0;">Order Summary</h3>
              ${order.items.map(item => `
                <div class="order-item">
                  <span>${item.name} × ${item.quantity}</span>
                  <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              
              ${order.shippingCost ? `
                <div class="order-item">
                  <span>Shipping</span>
                  <span>$${order.shippingCost.toFixed(2)}</span>
                </div>
              ` : ''}
              
              ${order.taxAmount ? `
                <div class="order-item">
                  <span>Tax</span>
                  <span>$${order.taxAmount.toFixed(2)}</span>
                </div>
              ` : ''}
              
              <div class="order-total">
                <span>Total</span>
                <span>$${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div style="margin: 20px 0;">
              <h4>Shipping Address</h4>
              <p>
                ${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}<br>
                ${order.shippingAddress?.street}<br>
                ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}<br>
                ${order.shippingAddress?.country}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/track-order?order=${order.orderNumber}" class="button">Track Your Order</a>
            </div>
            
            <p><strong>What's next?</strong> We'll send you another email when your order ships.</p>
          </div>
          
          <div class="footer">
            <p style="margin: 0; opacity: 0.7;">
              Questions? Contact us at <a href="mailto:hello@s-creations.com" style="color: #4ecdc4;">hello@s-creations.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Order shipped email
  orderShipped: (order) => ({
    subject: `Your Order Has Shipped! 🚚 - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #3b82f6, #4ecdc4); padding: 30px 20px; text-align: center; color: white; }
          .content { padding: 30px; }
          .tracking-info { background: #f0f9ff; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Your Order is on the Way! 🚚</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Tracking information inside</p>
          </div>
          
          <div class="content">
            <h2>Great news, ${order.shippingAddress?.firstName || 'Valued Customer'}!</h2>
            <p>Your order <strong>${order.orderNumber}</strong> has been shipped and is on its way to you.</p>
            
            <div class="tracking-info">
              <h3 style="margin-top: 0; color: #3b82f6;">Tracking Information</h3>
              <p><strong>Tracking Number:</strong> ${order.shipping?.trackingNumber || 'Not available'}</p>
              <p><strong>Carrier:</strong> ${order.shipping?.carrier || 'Standard Shipping'}</p>
              ${order.shipping?.estimatedDelivery ? `
                <p><strong>Estimated Delivery:</strong> ${new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>
              ` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${order.shipping?.trackingUrl || `${process.env.FRONTEND_URL}/track-order?order=${order.orderNumber}`}" class="button">
                Track Your Package
              </a>
            </div>
            
            <p><strong>Delivery Instructions:</strong></p>
            <ul>
              <li>Please ensure someone is available to receive the package</li>
              <li>Check your tracking regularly for updates</li>
              <li>Contact the carrier directly for delivery questions</li>
            </ul>
          </div>
          
          <div class="footer">
            <p style="margin: 0; opacity: 0.7;">
              Need help? Contact us at <a href="mailto:hello@s-creations.com" style="color: #4ecdc4;">hello@s-creations.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Password reset email
  passwordReset: (user, resetToken) => ({
    subject: 'Reset Your S-Creations Password 🔒',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #ef4444, #f59e0b); padding: 30px 20px; text-align: center; color: white; }
          .content { padding: 30px; }
          .warning { background: #fef3f2; border: 2px solid #ef4444; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Password Reset Request</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Secure your account</p>
          </div>
          
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>We received a request to reset your password for your S-Creations account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" class="button">
                Reset Your Password
              </a>
            </div>
            
            <div class="warning">
              <p><strong>Important:</strong> This password reset link will expire in 1 hour.</p>
              <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
            </div>
            
            <p>For security reasons, we recommend:</p>
            <ul>
              <li>Choosing a strong, unique password</li>
              <li>Not reusing passwords across different sites</li>
              <li>Enabling two-factor authentication if available</li>
            </ul>
          </div>
          
          <div class="footer">
            <p style="margin: 0; opacity: 0.7;">
              S-Creations Security Team
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Admin notification for new order
  adminNewOrder: (order) => ({
    subject: `📦 New Order Received - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #8b5cf6, #6a5acd); padding: 20px; text-align: center; color: white; }
          .content { padding: 20px; }
          .order-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">New Order Alert</h2>
          </div>
          
          <div class="content">
            <h3>Order #${order.orderNumber}</h3>
            
            <div class="order-info">
              <p><strong>Customer:</strong> ${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}</p>
              <p><strong>Email:</strong> ${order.shippingAddress?.email}</p>
              <p><strong>Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
              <p><strong>Items:</strong> ${order.items.length}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.FRONTEND_URL}/admin/orders/${order._id}" class="button">
                View Order in Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Enhanced email service with error handling and logging
const sendEmail = async (to, templateName, data, options = {}) => {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(data);
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'S-Creations',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      ...options
    };

    const result = await transporter.sendMail(mailOptions);
    
    // Log successful email sending
    console.log(`✅ Email sent successfully:`, {
      to,
      template: templateName,
      messageId: result.messageId,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };
  } catch (error) {
    console.error('❌ Email sending failed:', {
      to,
      template: templateName,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    // Don't throw error for email failures to avoid breaking the main process
    return {
      success: false,
      error: error.message
    };
  }
};

// Batch email sending for notifications
const sendBulkEmail = async (recipients, templateName, data) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, templateName, data);
    results.push({ recipient, ...result });
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

// Test email configuration
const testEmailService = async () => {
  try {
    const testResult = await sendEmail(
      process.env.EMAIL_USER,
      'welcome',
      { name: 'Test User', email: 'test@example.com' }
    );
    
    console.log('📧 Email service test:', testResult.success ? 'PASSED' : 'FAILED');
    return testResult;
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  testEmailService,
  emailTemplates
};
