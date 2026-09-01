const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    isVeg: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);
