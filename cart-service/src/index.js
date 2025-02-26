const express = require("express")
const dotenv = require("dotenv")
const redis = require("redis")
const cartRoutes = require("./routes/cartRoutes")

dotenv.config()

const app = express()

app.use(express.json())

app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Cart Service is running on http://localhost:${PORT}`);
});