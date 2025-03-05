const express = require("express");
const router = express.Router();
const { sendEmailNotification } = require("../controllers/notificationController");

router.post("/", sendEmailNotification);

module.exports = router;
