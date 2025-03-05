const express = require("express");
const router = express.Router();
const { createReview, getReviewsForProduct } = require("../controllers/reviewController");

router.post("/", createReview);

router.get("/product/:productId", getReviewsForProduct);

module.exports = router;
