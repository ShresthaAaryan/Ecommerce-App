const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/", cartController.addItemToCart);
router.put("/item/:id", cartController.updateCartItem);
router.delete("/item/:id", cartController.removeCartItem);
router.get("/", cartController.getCart);

module.exports = router;
