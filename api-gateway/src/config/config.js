const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 8080,
  services: {
    user: process.env.USER_SERVICE_URL,
    product: process.env.PRODUCT_SERVICE_URL,
    order: process.env.ORDER_SERVICE_URL,
    payment: process.env.PAYMENT_SERVICE_URL,
    cart: process.env.CART_SERVICE_URL,
    notification: process.env.NOTIFICATION_SERVICE_URL,
    review: process.env.REVIEW_SERVICE_URL,
  },
};
