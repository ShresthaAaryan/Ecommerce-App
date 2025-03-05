const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT || 8080,
  services: {
    user: process.env.USER_SERVICE_URL || "http://localhost:3001",
    product: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
    order: process.env.ORDER_SERVICE_URL || "http://localhost:3003",
    payment: process.env.PAYMENT_SERVICE_URL || "http://localhost:3004",
    cart: process.env.CART_SERVICE_URL || "http://localhost:3005",
    notification: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006",
    review: process.env.REVIEW_SERVICE_URL || "http://localhost:3007",
  },
};
