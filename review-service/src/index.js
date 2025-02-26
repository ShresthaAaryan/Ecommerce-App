const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const reviewRoutes = require("./routes/reviewRoutes");
dotenv.config();

const app = express();

app.use(express.json());

app.use("/reviews", reviewRoutes);

const connectToMongoDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI) 
        console.log('Connected to MongoDB')
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

const PORT = process.env.PORT || 3007;

const startServer = async () =>{
    await connectToMongoDB()

    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()