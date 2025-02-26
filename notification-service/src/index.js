const express = require("express");
const dotenv = require("dotenv");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

const app = express();

app.use(express.json());

app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Notification Service is running on http://localhost:${PORT}`);
});
