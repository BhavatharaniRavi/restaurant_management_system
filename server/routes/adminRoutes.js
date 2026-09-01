const express = require("express");
const {
  getDashboardStats,
  getPopularItems,
  getSalesReport,
  getCustomers,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/reports/popular-items", getPopularItems);
router.get("/reports/sales", getSalesReport);
router.get("/customers", getCustomers);

module.exports = router;
