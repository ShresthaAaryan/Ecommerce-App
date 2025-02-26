const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Product name is reuqired"],
        trim: true,
    },
    price:{
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Product price cannot be negative"]
    },
    description:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
}
)

module.exports = mongoose.model("Product", productSchema)