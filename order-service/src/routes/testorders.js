const mongoose = require("mongoose");
const Order = require("../models/Order");

mongoose.connect("mongodb://localhost:27017/testdb", {});

const testOrder = new Order(
    {
        "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
        "items": [
          {
            "productId": "64f1a2b3c4d5e6f7a8b9c0d2",
            "quantity": 2,
            "price": 50
          }
        ],
        "totalAmount": 100
      }
);

testOrder
  .save()
  .then(() => {
    console.log("Order saved successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error saving Order:", err.message);
    mongoose.connection.close();
  });