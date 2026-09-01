const express = require("express");
const { getTables, createTable, updateTable, deleteTable } = require("../controllers/tableController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getTables);
router.post("/", protect, adminOnly, createTable);
router.put("/:id", protect, adminOnly, updateTable);
router.delete("/:id", protect, adminOnly, deleteTable);

module.exports = router;
