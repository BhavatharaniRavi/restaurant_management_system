const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    orderType: { type: String, enum: ["dine-in", "takeaway"], default: "takeaway" },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", default: null },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["placed", "preparing", "ready", "served", "delivered", "cancelled"],
      default: "placed",
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
