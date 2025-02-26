const mongoose = require("mongoose");
const Product = require("../models/Product");

// Connect to a test database
mongoose.connect("mongodb://localhost:27017/testdb", {});

// Test data
const testProduct = new Product({
  name: "Paint",
  price: 21,
  description: "Wallahi",
});

// Save the test Product
testProduct
  .save()
  .then(() => {
    console.log("Product saved successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error saving Product:", err.message);
    mongoose.connection.close();
  });
