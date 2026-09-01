const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// @desc   Get high-level dashboard statistics
// @route  GET /api/admin/dashboard
// @access Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenueAgg, totalReservations, totalCustomers, totalRestaurants] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Reservation.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Restaurant.countDocuments({ isActive: true }),
      ]);

    const pendingOrders = await Order.countDocuments({ status: { $in: ["placed", "preparing"] } });
    const pendingReservations = await Reservation.countDocuments({ status: "pending" });

    res.json({
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      totalReservations,
      totalCustomers,
      totalRestaurants,
      pendingOrders,
      pendingReservations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Report: most popular menu items by order frequency
// @route  GET /api/admin/reports/popular-items
// @access Private/Admin
const getPopularItems = async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItemId",
          name: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);
    res.json({ items: result });
  } catch (err) {
    next(err);
  }
};

// @desc   Report: daily sales for the last N days
// @route  GET /api/admin/reports/sales
// @access Private/Admin
const getSalesReport = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ days, report: result });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all customers with basic order-count summary
// @route  GET /api/admin/customers
// @access Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });
    res.json({ count: customers.length, customers });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats, getPopularItems, getSalesReport, getCustomers };
