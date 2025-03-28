const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);

router.get("/:id", orderController.getOrderById);

router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;
