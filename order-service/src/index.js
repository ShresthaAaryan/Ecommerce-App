const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const orderRoutes = require("./routes/orderRoutes")

dotenv.config()

const app = express()

app.use(express.json())

app.use("/orders", orderRoutes)

const connectToMongoDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")
    }
    catch(error){
        console.log("Error connecting to MongoDB", error.message)
        process.exit(1)
    }
}

const PORT = process.env.PORT || 3003;

const startServer = async() =>{
    await connectToMongoDB()
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()

