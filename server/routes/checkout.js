const express = require('express');
const router = express.Router();

// @desc    Get payment options
// @route   GET /api/checkout/payment-options
router.get('/payment-options', (req, res) => {
  res.json({
    yoco: {
      enabled: true,
      publicKey: process.env.YOCO_PUBLIC_KEY,
      checkoutUrl: 'https://checkout.yoco.com/checkout'
    },
    eft: {
      enabled: true,
      instructions: `
        Please EFT the total amount to:
        Bank: ${process.env.BUSINESS_BANK_NAME}
        Account Holder: ${process.env.BUSINESS_ACCOUNT_HOLDER}
        Account Number: ${process.env.BUSINESS_ACCOUNT_NUMBER}
        Reference: [Your Order ID]
      `.trim()
    },
    contactEmail: process.env.BUSINESS_EMAIL
  });
});

module.exports = router;
