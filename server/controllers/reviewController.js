const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");

const recalcRestaurantRating = async (restaurantId) => {
  const reviews = await Review.find({ restaurantId });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  await Restaurant.findByIdAndUpdate(restaurantId, { rating: Math.round(avg * 10) / 10 });
};

const getReviews = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
    const reviews = await Review.find(filter).populate("userId", "name").sort({ createdAt: -1 });
    res.json({ count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { restaurantId, orderId, rating, comment } = req.body;
    if (!restaurantId || !rating) {
      return res.status(400).json({ message: "restaurantId and rating are required" });
    }

    const review = await Review.create({
      userId: req.user._id,
      restaurantId,
      orderId,
      rating,
      comment,
    });

    await recalcRestaurantRating(restaurantId);

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = review.userId.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    await recalcRestaurantRating(review.restaurantId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviews, createReview, deleteReview };
