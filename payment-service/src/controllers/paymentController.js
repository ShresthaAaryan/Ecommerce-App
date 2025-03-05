const Stripe = require("stripe");
const stripe = Stripe("sk_test_51QwoadIRPCQiuouyHPldxj25TfU7uptOCARMQ8ynoYoZ9b2Rvf6hSEdIQbovsDPBBzLT4ejXbKpH7YzgreEs2KMm00CggRKxQ9"); // Initialize Stripe
const Payment = require("../models/Payment"); // Import the Payment model

const processPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethod } = req.body;

        // Validate payment details
        if (!amount || !currency || !paymentMethod) {
            return res.status(400).json({ message: "Amount, currency, and payment method are required" });
        }

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in cents (e.g., $10 = 1000 cents)
            currency,
            payment_method: paymentMethod,
            confirm: true, // Automatically confirm the payment
            automatic_payment_methods: {
                enabled: true, // Enable automatic payment methods
                allow_redirects: "never", // Disable redirect-based payment methods
            },
        });

        // Save payment to database
        const payment = new Payment({
            amount,
            currency,
            paymentMethod,
            status: paymentIntent.status,
        });
        await payment.save();

        // Respond based on payment status
        if (paymentIntent.status === "succeeded") {
            return res.status(200).json({ message: "Payment successful", payment });
        } else {
            return res.status(400).json({ message: "Payment failed", payment });
        }
    } catch (error) {
        console.error("Error processing payment:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    processPayment,
};
