const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Product price cannot be negative"],
  },
  gender:{
    type: String,
    enum: ["Male", "Female", "Unisex"],
  },
  description: {
    type: String,
    required: true,
  },  
  imageData: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("Product", productSchema);
