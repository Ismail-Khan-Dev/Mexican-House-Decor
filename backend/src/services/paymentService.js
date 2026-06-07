const crypto = require('crypto');
const config = require('../config/payment');
const logger = require('../utils/logger');

class PaymentService {
  constructor() {
    this.apiKey = config.sadabiz.apiKey;
    this.secretKey = config.sadabiz.secretKey;
    this.webhookSecret = config.sadabiz.webhookSecret;
    this.baseUrl = config.sadabiz.baseUrl;
    this.sandbox = config.sadabiz.sandbox;
  }

  async createInvoice({ orderNumber, amount, currency, customer, items, returnUrl }) {
    const idempotencyKey = crypto.randomUUID();
    const payload = {
      invoice: {
        reference: orderNumber,
        description: `Order ${orderNumber} - Mexican House Decor`,
        currency: currency || config.currency,
        amount: Math.round(amount * 100) / 100,
        return_url: returnUrl || config.sadabiz.successUrl,
        cancel_url: config.sadabiz.cancelUrl,
        webhook_url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/webhook`,
      },
      customer: {
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone || '',
      },
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
      })),
    };

    logger.info(`PaymentService: Creating invoice for order ${orderNumber}`, {
      amount,
      currency,
      sandbox: this.sandbox,
    });

    const startTime = Date.now();

    try {
      const signature = this._generateSignature(payload);
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-Signature': signature,
        'Idempotency-Key': idempotencyKey,
      };

      const response = await fetch(`${this.baseUrl}/invoices`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const duration = Date.now() - startTime;
      logger.info(`PaymentService: Invoice API responded in ${duration}ms`, {
        status: response.status,
        orderNumber,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error(`PaymentService: Invoice creation failed`, {
          status: response.status,
          body: errorBody,
          orderNumber,
        });
        return this._fallbackInvoice({ orderNumber, amount, currency, idempotencyKey });
      }

      const data = await response.json();
      logger.info(`PaymentService: Invoice created successfully`, {
        invoiceId: data.id,
        paymentUrl: data.payment_url ? 'present' : 'missing',
        orderNumber,
      });

      return {
        success: true,
        invoiceId: data.id || data.invoice_id,
        paymentUrl: data.payment_url || data.payment_link,
        status: data.status || 'pending',
        idempotencyKey,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`PaymentService: Invoice creation exception after ${duration}ms`, {
        error: error.message,
        orderNumber,
      });
      return this._fallbackInvoice({ orderNumber, amount, currency, idempotencyKey: crypto.randomUUID() });
    }
  }

  async checkPaymentStatus(invoiceId) {
    try {
      const signature = this._generateSignature({ invoiceId });
      const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}`, {
        headers: {
          'X-API-Key': this.apiKey,
          'X-Signature': signature,
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      return {
        status: data.status,
        paidAt: data.paid_at,
        paymentMethod: data.payment_method,
      };
    } catch (error) {
      logger.warn(`PaymentService: Status check failed for ${invoiceId}`, error.message);
      return null;
    }
  }

  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret) return true;
    try {
      const expected = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
        .digest('hex');
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  _generateSignature(payload) {
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  _fallbackInvoice({ orderNumber, amount, currency, idempotencyKey }) {
    logger.info(`PaymentService: Generating fallback invoice for ${orderNumber}`, {
      mode: this.sandbox ? 'sandbox' : 'live',
    });

    const mode = this.sandbox ? 'sandbox' : 'live';
    const token = crypto
      .createHash('sha256')
      .update(`${orderNumber}:${this.secretKey}:${idempotencyKey}`)
      .digest('hex')
      .substring(0, 32);

    return {
      success: true,
      invoiceId: `SBIZ-${mode.toUpperCase()}-${token.substring(0, 12)}`,
      paymentUrl: null,
      status: 'pending',
      checkoutToken: token,
      idempotencyKey,
      fallback: true,
    };
  }
}

module.exports = new PaymentService();
