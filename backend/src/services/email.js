const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransport = () => {
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || '',
      pass: process.env.ETHEREAL_PASS || '',
    },
  });
};

const sendOrderConfirmation = async (order, user) => {
  try {
    const transport = createTransport();
    const from = process.env.SMTP_FROM || 'orders@mexicanhousedecor.com';

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${item.productName}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${item.price.toFixed(2)}</td></tr>`
      )
      .join('');

    const mailOptions = {
      from: `"Mexican House Decor" <${from}>`,
      to: user.email,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#2c1810;color:#fff;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="margin:0;font-size:20px;">Thank You for Your Order!</h1>
          </div>
          <div style="padding:24px;border:1px solid #e0d5c7;border-top:0;border-radius:0 0 8px 8px;">
            <p style="color:#2c1810;">Hi ${user.firstName},</p>
            <p style="color:#666;">Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <thead><tr style="background:#faf5ef;">
                <th style="padding:8px;text-align:left;">Item</th>
                <th style="padding:8px;text-align:center;">Qty</th>
                <th style="padding:8px;text-align:right;">Price</th>
              </tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="border-top:2px solid #2c1810;padding-top:12px;margin-top:12px;">
              <p style="display:flex;justify-content:space-between;color:#666;margin:4px 0;">
                <span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span>
              </p>
              <p style="display:flex;justify-content:space-between;color:#666;margin:4px 0;">
                <span>Shipping</span><span>${order.shippingCost === 0 ? 'Free' : '$' + order.shippingCost.toFixed(2)}</span>
              </p>
              <p style="display:flex;justify-content:space-between;color:#2c1810;font-weight:bold;margin:8px 0;font-size:18px;">
                <span>Total</span><span>$${order.total.toFixed(2)}</span>
              </p>
            </div>
            <div style="margin-top:24px;padding:16px;background:#faf5ef;border-radius:6px;">
              <p style="color:#2c1810;font-weight:600;margin:0 0 8px;">Shipping To</p>
              <p style="color:#666;margin:2px 0;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
              <p style="color:#666;margin:2px 0;">${order.shippingAddress.street}</p>
              <p style="color:#666;margin:2px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            </div>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    logger.info(`Order confirmation email sent: ${order.orderNumber} -> ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send order email: ${error.message}`);
  }
};

const sendShippingUpdate = async (order, user) => {
  try {
    const transport = createTransport();
    const from = process.env.SMTP_FROM || 'orders@mexicanhousedecor.com';

    const mailOptions = {
      from: `"Mexican House Decor" <${from}>`,
      to: user.email,
      subject: `Order Shipped — ${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#2c1810;color:#fff;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="margin:0;font-size:20px;">Your Order Has Shipped!</h1>
          </div>
          <div style="padding:24px;border:1px solid #e0d5c7;border-top:0;border-radius:0 0 8px 8px;">
            <p style="color:#2c1810;">Hi ${user.firstName},</p>
            <p style="color:#666;">Your order <strong>${order.orderNumber}</strong> is on its way!</p>
            ${order.trackingNumber ? `<p style="color:#666;">Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
            <div style="margin-top:24px;padding:16px;background:#faf5ef;border-radius:6px;">
              <p style="color:#2c1810;font-weight:600;margin:0 0 8px;">Shipping To</p>
              <p style="color:#666;margin:2px 0;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
              <p style="color:#666;margin:2px 0;">${order.shippingAddress.street}</p>
              <p style="color:#666;margin:2px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            </div>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    logger.info(`Shipping update email sent: ${order.orderNumber} -> ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send shipping email: ${error.message}`);
  }
};

module.exports = { sendOrderConfirmation, sendShippingUpdate };
