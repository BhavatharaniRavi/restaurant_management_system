const express = require("express");
const {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getReservations);
router.post("/", protect, createReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, adminOnly, deleteReservation);

module.exports = router;
