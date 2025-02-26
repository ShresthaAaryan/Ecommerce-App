const addItemToCart = async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
  
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const redisClient = req.app.locals.redisClient;
  
      // Add item to cart in Redis
      await redisClient.hSet(`cart:${userId}`, productId, quantity);
  
      res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  const updateCartItem = async (req, res) => {
    try {
      const { userId } = req.body;
      const { id: productId } = req.params;
      const { quantity } = req.body;
  
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const redisClient = req.app.locals.redisClient;
  
      // Update item quantity in Redis
      await redisClient.hSet(`cart:${userId}`, productId, quantity);
  
      res.status(200).json({ message: "Cart item updated" });
    } catch (error) {
      console.error("Error updating cart item:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  const removeCartItem = async (req, res) => {
    try {
      const { userId } = req.body;
      const { id: productId } = req.params;
  
      if (!userId || !productId) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const redisClient = req.app.locals.redisClient;
  
      // Remove item from cart in Redis
      await redisClient.hDel(`cart:${userId}`, productId);
  
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  const getCart = async (req, res) => {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const redisClient = req.app.locals.redisClient;
  
      // Retrieve cart from Redis
      const cart = await redisClient.hGetAll(`cart:${userId}`);
  
      res.status(200).json({ cart });
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  module.exports = {
    addItemToCart,
    updateCartItem,
    removeCartItem,
    getCart,
  };