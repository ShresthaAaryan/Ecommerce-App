const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity:{
            type: Number,
            required: true,
            min: [1, "Quantity must be atleast 1"],
        },
        price:{
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: [0, "Total amount cannot be negative"],
    },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered"], // Allowed statuses
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("Order", orderSchema)