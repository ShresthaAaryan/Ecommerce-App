const Review = require("../models/Review");

const createReview = async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  try {
    if (!productId || !userId || !rating) {
      return res
        .status(400)
        .json({ message: "Product ID, User ID, and Rating are required" });
    }
    const review = new Review({
      productId,
      userId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createReview, getReviewsForProduct };
