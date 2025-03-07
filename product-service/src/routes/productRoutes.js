const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");


// Existing product routes
router.post("/products", productController.createProduct);
router.get("/products", productController.getProduct);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);



module.exports = router;
