const express = require("express")
const router = express.Router()

const { createProxyMiddleware } = require("http-proxy-middleware");


const config = require("../config/config");

router.use("/users", createProxyMiddleware({ target: config.services.user, changeOrigin: true }));
router.use("/products", createProxyMiddleware({ target: config.services.product, changeOrigin: true }));
router.use("/orders", createProxyMiddleware({ target: config.services.order, changeOrigin: true }));
router.use("/payments", createProxyMiddleware({ target: config.services.payment, changeOrigin: true }));
router.use("/cart", createProxyMiddleware({ target: config.services.cart, changeOrigin: true }));
router.use("/notifications", createProxyMiddleware({ target: config.services.notification, changeOrigin: true }));
router.use("/reviews", createProxyMiddleware({ target: config.services.review, changeOrigin: true }));

module.exports = router