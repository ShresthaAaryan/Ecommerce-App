const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const reviewRoutes = require("./routes/reviewRoutes");
const cors = require("cors");


dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use("/api/reviews", reviewRoutes);

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 3007;

const startServer = async () => {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();