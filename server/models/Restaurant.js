const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    cuisine: { type: String, default: "Multi-Cuisine" },
    address: { type: String, required: true },
    openingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "22:00" },
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    imageUrl: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
