const express = require("express");
const dotenv = require("dotenv");
const redis = require("redis");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config();

const app = express();

app.use(express.json());

// Mount the cart routes at "/api/cart"
app.use("/api/cart", cartRoutes);

// Create a Redis client using the URL from your .env file
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

// Listen for Redis connection events
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

// Connect to Redis
redisClient.connect();

// Attach Redis client to the app for use in routes/controllers
app.locals.redisClient = redisClient;

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Cart Service is running on http://localhost:${PORT}`);
});
