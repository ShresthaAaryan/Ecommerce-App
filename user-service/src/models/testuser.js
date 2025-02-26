const mongoose = require("mongoose");
const User = require("../models/user");

// Connect to a test database
mongoose.connect("mongodb://localhost:27017/testdb", {});

// Test data
const testUser = new User({
  username: "testuser",
  email: "test@example.com",
  passwordHash: "password123",
});

// Save the test user
testUser
  .save()
  .then(() => {
    console.log("User saved successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error saving user:", err.message);
    mongoose.connection.close();
  });
