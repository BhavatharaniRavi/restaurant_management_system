const MenuItem = require("../models/MenuItem");

// @desc   Get menu items, optionally filtered by restaurant, category, or search term
// @route  GET /api/menu
// @access Public
const getMenuItems = async (req, res, next) => {
  try {
    const { restaurantId, categoryId, search } = req.query;
    const filter = {};

    if (restaurantId) filter.restaurantId = restaurantId;
    if (categoryId) filter.categoryId = categoryId;
    if (search) filter.$text = { $search: search };

    const items = await MenuItem.find(filter).populate("categoryId", "name").sort({ createdAt: -1 });
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("categoryId", "name");
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };
