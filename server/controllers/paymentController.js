const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// @desc   Initiate/process a payment for an order
//         NOTE: This simulates a payment-gateway transaction. In production, replace the
//         internals of this function with a call to a real gateway (e.g. Razorpay/Stripe)
//         and verify the transaction via webhook/signature before marking it successful.
// @route  POST /api/payments
// @access Private
const processPayment = async (req, res, next) => {
  try {
    const { orderId, method } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.userId.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: "Not authorized to pay for this order" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "This order has already been paid for" });
    }

    // Simulated gateway authorisation (always succeeds in this demo implementation)
    const transactionId = crypto.randomBytes(8).toString("hex").toUpperCase();

    const payment = await Payment.create({
      orderId: order._id,
      userId: req.user._id,
      amount: order.totalAmount,
      method: method || "card",
      status: "successful",
      transactionId,
    });

    order.paymentStatus = "paid";
    await order.save();

    await Notification.create({
      userId: req.user._id,
      message: `Payment of ₹${order.totalAmount} for order #${order._id.toString().slice(-6)} was successful.`,
      type: "order-update",
    });

    res.status(201).json({ payment, order });
  } catch (err) {
    next(err);
  }
};

// @desc   Get payment history for the logged-in user (or all, for admin)
// @route  GET /api/payments
// @access Private
const getPayments = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user._id };
    const payments = await Payment.find(filter).populate("orderId").sort({ createdAt: -1 });
    res.json({ count: payments.length, payments });
  } catch (err) {
    next(err);
  }
};

module.exports = { processPayment, getPayments };
