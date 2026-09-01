const express = require("express");
const {
  getNotifications,
  markAsRead,
  createNotification,
} = require("../controllers/notificationController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.post("/", protect, adminOnly, createNotification);

module.exports = router;
