// gateway.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const config = require("./config/config");

// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Mount API routes under /api
const apiRoutes = require("./routes/gatewayRoutes");
app.use("/api", apiRoutes);

// A simple root endpoint
app.get("/", (req, res) => {
  res.send("API Gateway is up and running!");
});

// Start the server
app.listen(config.port, () => {
  console.log(`API Gateway is running on port ${config.port}`);
});
