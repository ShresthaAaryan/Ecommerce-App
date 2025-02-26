const express = require("express")
const dotenv = require("dotenv")
const redis = require("redis")
const cartRoutes = require("./routes/cartRoutes")

dotenv.config()

const app = express()

app.use(express.json())

app.use("/cart", cartRoutes);

// Create a Redis client
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });
  
  // Connect to Redis
  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });
  
  redisClient.on("error", (err) => {
    console.error("Error connecting to Redis:", err);
  });
  
  redisClient.connect();
  
  // Attach Redis client to the app for use in routes/controllers
  app.locals.redisClient = redisClient;

  
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Cart Service is running on http://localhost:${PORT}`);
});