const Restaurant = require("../models/Restaurant");

// @desc   Get all restaurants (with optional search by name/cuisine)
// @route  GET /api/restaurants
// @access Public
const getRestaurants = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { cuisine: { $regex: search, $options: "i" } },
      ];
    }

    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
    res.json({ count: restaurants.length, restaurants });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single restaurant by ID
// @route  GET /api/restaurants/:id
// @access Public
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json({ restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc   Create a new restaurant
// @route  POST /api/restaurants
// @access Private/Admin
const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc   Update a restaurant
// @route  PUT /api/restaurants/:id
// @access Private/Admin
const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json({ restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete (deactivate) a restaurant
// @route  DELETE /api/restaurants/:id
// @access Private/Admin
const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json({ message: "Restaurant deactivated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
