const jwt = require("jsonwebtoken");

// Simple auth middleware that extracts userId from JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Debug log
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid auth header format');
      return res.status(401).json({ message: "Authentication required. Please provide a valid token." });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log('No token found after Bearer prefix');
      return res.status(401).json({ message: "Authentication token is missing" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully for user:', decoded.userId);

      // Set the userId in the request for controllers to use
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);

      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token has expired. Please log in again." });
      }

      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error during authentication" });
  }
};

module.exports = authMiddleware;
