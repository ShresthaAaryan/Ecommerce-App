require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Simple health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

// Improve error handling for MongoDB connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

// Connect to MongoDB with improved error handling
const connectToMongoDB = async () => {
  try {
    console.log("Connecting to MongoDB at:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {});
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.error(
      "Full error object:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
