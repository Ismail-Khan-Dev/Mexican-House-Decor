const crypto = require('crypto');
const https = require('https');
const logger = require('../utils/logger');

const JAZZCASH_SANDBOX = 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform';
const JAZZCASH_PRODUCTION = 'https://jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform';

const getConfig = () => ({
  merchantId: process.env.JAZZCASH_MERCHANT_ID,
  password: process.env.JAZZCASH_PASSWORD,
  integritySalt: process.env.JAZZCASH_INTEGRITY_SALT,
  returnUrl: process.env.JAZZCASH_RETURN_URL || 'http://localhost:5000/api/payment/jazzcash/callback',
  environment: process.env.JAZZCASH_ENVIRONMENT || 'sandbox',
});

const generateTransactionRef = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `T${timestamp}${random}`;
};

const generateSecureHash = (fields, integritySalt) => {
  const sortedKeys = Object.keys(fields).sort();
  const concatenated = sortedKeys.map((key) => fields[key]).join('&');
  const hash = crypto.createHmac('sha256', integritySalt).update(concatenated).digest('hex');
  return hash;
};

const initiatePayment = async ({ amount, orderRef, description }) => {
  const config = getConfig();
  const txnRefNo = generateTransactionRef();

  const amountInPaisa = Math.round(amount * 100);

  const dateTime = new Date();
  const txnDate = dateTime.toISOString().replace(/[-:]/g, '').split('.')[0];
  const expiryDate = new Date(dateTime.getTime() + 24 * 60 * 60 * 1000)
    .toISOString().replace(/[-:]/g, '').split('.')[0];

  const ppmpf1 = process.env.JAZZCASH_MPF1 || '';
  const ppmpf2 = process.env.JAZZCASH_MPF2 || '';
  const ppmpf3 = process.env.JAZZCASH_MPF3 || '';
  const ppmpf4 = process.env.JAZZCASH_MPF4 || '';
  const ppmpf5 = process.env.JAZZCASH_MPF5 || '';

  const fields = {
    pp_Version: '2.0',
    pp_TxnType: 'MIGS',
    pp_Language: 'EN',
    pp_MerchantID: config.merchantId,
    pp_Password: config.password,
    pp_TxnRefNo: txnRefNo,
    pp_Amount: amountInPaisa.toString(),
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: txnDate,
    pp_BillReference: orderRef,
    pp_Description: description || 'Mexican House Decor Purchase',
    pp_ReturnURL: config.returnUrl,
    pp_SecureHash: '',
    ppmpf_1: ppmpf1,
    ppmpf_2: ppmpf2,
    ppmpf_3: ppmpf3,
    ppmpf_4: ppmpf4,
    ppmpf_5: ppmpf5,
  };

  const hashInput = { ...fields };
  delete hashInput.pp_SecureHash;

  fields.pp_SecureHash = generateSecureHash(hashInput, config.integritySalt);

  const gatewayUrl = config.environment === 'production' ? JAZZCASH_PRODUCTION : JAZZCASH_SANDBOX;

  logger.info(`JazzCash payment initiated: ${txnRefNo}, amount: PKR ${amount}`);

  return {
    transactionRef: txnRefNo,
    redirectUrl: gatewayUrl,
    formFields: fields,
  };
};

const verifyPayment = (responseParams) => {
  const config = getConfig();

  const secureHash = responseParams.pp_SecureHash;
  if (!secureHash) {
    logger.error('JazzCash callback missing secure hash');
    return { valid: false, message: 'Missing secure hash' };
  }

  const fields = { ...responseParams };
  delete fields.pp_SecureHash;

  const expectedHash = generateSecureHash(fields, config.integritySalt);

  if (secureHash !== expectedHash) {
    logger.error('JazzCash hash mismatch - possible tampering');
    return { valid: false, message: 'Hash verification failed' };
  }

  const responseCode = responseParams.pp_ResponseCode;
  const isSuccess = responseCode === '000';

  logger.info(`JazzCash payment ${isSuccess ? 'succeeded' : 'failed'}: ${responseParams.pp_TxnRefNo}, code: ${responseCode}`);

  return {
    valid: true,
    success: isSuccess,
    transactionRef: responseParams.pp_TxnRefNo,
    orderRef: responseParams.pp_BillReference,
    responseCode,
    message: responseParams.pp_ResponseMessage || '',
    settledAmount: responseParams.pp_SettledAmount,
    bankTransactionId: responseParams.pp_BankTransactionID || '',
  };
};

module.exports = {
  initiatePayment,
  verifyPayment,
  generateTransactionRef,
};
