const logger = require('../utils/logger');

const paymentConfig = {
  sadabiz: {
    apiKey: process.env.SADABIZ_API_KEY || '',
    secretKey: process.env.SADABIZ_SECRET_KEY || '',
    webhookSecret: process.env.SADABIZ_WEBHOOK_SECRET || '',
    baseUrl: process.env.SADABIZ_BASE_URL || 'https://api.sadapay.pk/v1',
    sandbox: process.env.SADABIZ_SANDBOX === 'true' || true,
    successUrl: process.env.SADABIZ_SUCCESS_URL || 'http://localhost:3000/payment/success',
    cancelUrl: process.env.SADABIZ_CANCEL_URL || 'http://localhost:3000/payment/cancel',
  },
  currency: 'USD',
  defaultTaxRate: 0.08,
  freeShippingThreshold: 100,
  defaultShippingCost: 10,
};

const validateConfig = () => {
  if (!paymentConfig.sadabiz.apiKey) {
    logger.warn('SadaBiz API key not configured. Payment will use sandbox mode.');
  }
  if (!paymentConfig.sadabiz.secretKey) {
    logger.warn('SadaBiz secret key not configured. Payment will use sandbox mode.');
  }
};

validateConfig();

module.exports = paymentConfig;
