const express = require("express");
const router = express.Router();
const { sendBillEmail } = require("../controllers/billController");
const { protect } = require("../middleware/auth");

// Send bill via email
router.post("/send-bill", protect, sendBillEmail);

module.exports = router;
