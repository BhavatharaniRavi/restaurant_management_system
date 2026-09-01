const express = require("express");
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);
router.post("/", protect, adminOnly, createMenuItem);
router.put("/:id", protect, adminOnly, updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

module.exports = router;
