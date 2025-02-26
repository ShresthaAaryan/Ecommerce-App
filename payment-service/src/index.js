const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

const app = express();

app.use(express.json());

app.use("/payments", paymentRoutes);

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 3004;
const startServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => {
        console.log(`Payment service is running on port ${PORT}`);
    });
};

startServer();