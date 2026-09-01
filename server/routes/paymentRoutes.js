const express = require("express");
const { processPayment, getPayments } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getPayments);
router.post("/", protect, processPayment);

module.exports = router;
