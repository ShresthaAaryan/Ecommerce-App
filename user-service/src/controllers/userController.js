const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log("Validation failed - missing fields:", {
        hasName: !!name,
        hasEmail: !!email,
        hasPassword: !!password
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Email already exists:", email);
        return res.status(400).json({ message: "Email already exists" });
      }
    } catch (dbError) {
      console.error("Database error during existing user check:", dbError);
      return res.status(500).json({ message: "Database error - please try again" });
    }

    // Hash password
    let passwordHash;
    try {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
      console.log("Password hashed successfully");
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return res.status(500).json({ message: "Error processing password" });
    }

    // Create user
    let newUser;
    try {
      newUser = new User({
        name,
        email,
        passwordHash,
        memberSince: new Date()
      });

      // Log the user object before saving to ensure name is present
      console.log("User object before saving:", {
        name: newUser.name,
        email: newUser.email,
        hasNameProperty: newUser.hasOwnProperty('name')
      });

      await newUser.save();
      console.log("User saved to database successfully");
    } catch (saveError) {
      console.error("Error saving user to database:", saveError);
      return res.status(500).json({ message: "Error creating user account" });
    }

    // Create token
    let token;
    try {
      token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
      console.log("JWT token created successfully");
    } catch (tokenError) {
      console.error("Error creating JWT token:", tokenError, "JWT_SECRET exists:", !!process.env.JWT_SECRET);
      return res.status(500).json({ message: "Error creating authentication token" });
    }

    // Structured response matching what frontend expects
    const userData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      memberSince: newUser.memberSince
    };

    console.log("User registered successfully:", {
      userId: userData.id,
      name: userData.name // Log the name to verify it's included
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: userData.id,
      user: userData
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    console.log("Login request received:", { email: req.body.email });
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Structured response matching what frontend expects
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      memberSince: user.memberSince,
      address: user.address,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar
    };

    console.log("User logged in successfully:", { userId: userData.id });

    res.json({
      message: "Login successful",
      token,
      userId: userData.id, // Include userId directly in response
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {

    // Find user by ID (from token)
    const user = await User.findById(req.userId).select("-passwordHash");

    if (!user) {
      console.log("User not found:", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile data
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      memberSince: user.memberSince,
      phoneNumber: user.phoneNumber || '',
      address: user.address || {},
      avatar: user.avatar || null
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error retrieving profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;

    console.log("Updating profile for user:", req.userId);
    console.log("Update data:", req.body);

    // Create update object with provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      console.log("User not found for update:", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Return updated profile
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      memberSince: updatedUser.memberSince,
      phoneNumber: updatedUser.phoneNumber || '',
      address: updatedUser.address || {},
      avatar: updatedUser.avatar || null
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    user.passwordHash = passwordHash;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

// Get user profile by ID
const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Getting profile for user with ID: ${userId}`);

    // Find user by ID from URL parameter
    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Log the user document to debug the name issue
    console.log("User document from database:", {
      id: user._id,
      name: user.name,
      email: user.email,
      hasNameField: user.hasOwnProperty('name'),
      allFields: Object.keys(user._doc || {})
    });

    // Return user profile data
    const profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      memberSince: user.memberSince,
      phoneNumber: user.phoneNumber || '',
      address: user.address || {},
      avatar: user.avatar || null
    };

    console.log("Profile data being sent:", profileData);

    res.status(200).json(profileData);
  } catch (error) {
    console.error("Get profile by ID error:", error);
    res.status(500).json({ message: "Server error retrieving profile" });
  }
};

// Update user profile by ID
const updateUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phoneNumber, address } = req.body;

    console.log(`Updating profile for user with ID: ${userId}`);
    console.log("Update data received:", {
      name,
      phoneNumber,
      address,
      allFields: Object.keys(req.body)
    });

    // Create update object with provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;

    console.log("Update data being applied:", updateData);

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      console.log("User not found for update:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated user document:", {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      hasNameField: updatedUser.hasOwnProperty('name'),
      allFields: Object.keys(updatedUser._doc || {})
    });

    // Return updated profile
    const responseData = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      memberSince: updatedUser.memberSince,
      phoneNumber: updatedUser.phoneNumber || '',
      address: updatedUser.address || {},
      avatar: updatedUser.avatar || null
    };

    console.log("Response data being sent:", responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Update profile by ID error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Update password by ID
const updatePasswordById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    user.passwordHash = passwordHash;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update by ID error:", error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getUserProfileById,
  updateUserProfileById,
  updatePasswordById
};
