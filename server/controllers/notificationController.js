const Notification = require("../models/Notification");

// @desc   Get notifications for the logged-in user
// @route  GET /api/notifications
// @access Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ count: notifications.length, notifications });
  } catch (err) {
    next(err);
  }
};

// @desc   Mark a notification as read
// @route  PUT /api/notifications/:id/read
// @access Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ notification });
  } catch (err) {
    next(err);
  }
};

// @desc   Admin: broadcast an offer/notification to all customers or a specific user
// @route  POST /api/notifications
// @access Private/Admin
const createNotification = async (req, res, next) => {
  try {
    const { userId, message, type } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ message: "userId and message are required" });
    }
    const notification = await Notification.create({ userId, message, type: type || "general" });
    res.status(201).json({ notification });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead, createNotification };
