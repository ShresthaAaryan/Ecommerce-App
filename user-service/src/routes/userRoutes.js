const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

// Log middleware to trace API calls
router.use((req, res, next) => {
    console.log(`API Request: ${req.method} ${req.originalUrl}`);
    next();
});

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes
router.get("/profile", authMiddleware, userController.getUserProfile);
router.get("/profile/:userId", authMiddleware, userController.getUserProfileById);
router.put("/profile", authMiddleware, userController.updateUserProfile);
router.put("/profile/:userId", authMiddleware, userController.updateUserProfileById);
router.put("/password", authMiddleware, userController.updatePassword);
router.put("/profile/:userId/password", authMiddleware, userController.updatePasswordById);

// Add a diagnostic route after the existing routes
router.get("/debug/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`Debug route called for user ID: ${userId}`);

        const User = require("../models/User");
        const user = await User.findById(userId).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                requestedId: userId
            });
        }

        return res.status(200).json({
            message: "User found",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                hasName: !!user.name,
                nameExists: user.hasOwnProperty('name'),
                documentKeys: Object.keys(user._doc || {})
            }
        });
    } catch (error) {
        console.error("Debug route error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;