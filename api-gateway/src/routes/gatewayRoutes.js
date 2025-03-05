// routes/apiRoutes.js
const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/config");

// Proxy the /users endpoint
router.use("/users", createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    onError(err, req, res) {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error occurred.");
    },
    proxyTimeout: 10000  // You can adjust the timeout if needed (in milliseconds)
  }));
  

// Proxy the /products endpoint
router.use("/products", createProxyMiddleware({
  target: config.services.product,
  changeOrigin: true,
}));

// Proxy the /orders endpoint
router.use("/orders", createProxyMiddleware({
  target: config.services.order,
  changeOrigin: true,
}));

// Proxy the /payments endpoint
router.use("/payments", createProxyMiddleware({
  target: config.services.payment,
  changeOrigin: true,
}));

// Proxy the /cart endpoint
router.use("/cart", createProxyMiddleware({
  target: config.services.cart,
  changeOrigin: true,
}));

// Proxy the /notifications endpoint
router.use("/notifications", createProxyMiddleware({
  target: config.services.notification,
  changeOrigin: true,
}));

// Proxy the /reviews endpoint
router.use("/reviews", createProxyMiddleware({
  target: config.services.review,
  changeOrigin: true,
}));

module.exports = router;
