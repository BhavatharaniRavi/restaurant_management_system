const Reservation = require("../models/Reservation");
const Table = require("../models/Table");
const Notification = require("../models/Notification");

const RESERVATION_WINDOW_MINUTES = 90; // a table is considered occupied for 90 minutes per booking

// @desc   Check whether a specific table is free at the requested date/time
const isTableAvailable = async (tableId, dateTime, excludeReservationId = null) => {
  const requested = new Date(dateTime);
  const windowStart = new Date(requested.getTime() - RESERVATION_WINDOW_MINUTES * 60000);
  const windowEnd = new Date(requested.getTime() + RESERVATION_WINDOW_MINUTES * 60000);

  const query = {
    tableId,
    status: { $in: ["pending", "confirmed"] },
    dateTime: { $gte: windowStart, $lte: windowEnd },
  };
  if (excludeReservationId) query._id = { $ne: excludeReservationId };

  const conflict = await Reservation.findOne(query);
  return !conflict;
};

// @desc   Get reservations (filterable by user, restaurant, or status)
// @route  GET /api/reservations
// @access Private
const getReservations = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role !== "admin") {
      filter.userId = req.user._id;
    } else if (req.query.restaurantId) {
      filter.restaurantId = req.query.restaurantId;
    }
    if (req.query.status) filter.status = req.query.status;

    const reservations = await Reservation.find(filter)
      .populate("restaurantId", "name address")
      .populate("tableId", "tableNumber capacity")
      .populate("userId", "name email phone")
      .sort({ dateTime: -1 });

    res.json({ count: reservations.length, reservations });
  } catch (err) {
    next(err);
  }
};

// @desc   Create a new table reservation
// @route  POST /api/reservations
// @access Private
const createReservation = async (req, res, next) => {
  try {
    const { restaurantId, tableId, dateTime, guests, specialRequest } = req.body;

    if (!restaurantId || !tableId || !dateTime || !guests) {
      return res.status(400).json({ message: "restaurantId, tableId, dateTime, and guests are required" });
    }

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: "Table not found" });
    if (guests > table.capacity) {
      return res.status(400).json({ message: `Table capacity is ${table.capacity}; reduce the number of guests` });
    }

    const available = await isTableAvailable(tableId, dateTime);
    if (!available) {
      return res.status(409).json({ message: "Selected table is already booked around this time. Please choose another slot." });
    }

    const reservation = await Reservation.create({
      userId: req.user._id,
      restaurantId,
      tableId,
      dateTime,
      guests,
      specialRequest,
      status: "pending",
    });

    await Notification.create({
      userId: req.user._id,
      message: `Your table reservation request for ${new Date(dateTime).toLocaleString()} has been received and is pending confirmation.`,
      type: "reservation-reminder",
    });

    res.status(201).json({ reservation });
  } catch (err) {
    next(err);
  }
};

// @desc   Update reservation status (confirm/cancel/complete) — Admin, or cancel by owning customer
// @route  PUT /api/reservations/:id
// @access Private
const updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    const isOwner = reservation.userId.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not authorized to modify this reservation" });
    }

    const { status, dateTime, guests } = req.body;

    if (req.user.role !== "admin" && status && status !== "cancelled") {
      return res.status(403).json({ message: "Customers may only cancel a reservation" });
    }

    if (dateTime) reservation.dateTime = dateTime;
    if (guests) reservation.guests = guests;
    if (status) reservation.status = status;

    await reservation.save();

    if (status) {
      await Notification.create({
        userId: reservation.userId,
        message: `Your reservation status has been updated to "${status}".`,
        type: "reservation-reminder",
      });
    }

    res.json({ reservation });
  } catch (err) {
    next(err);
  }
};

const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReservations, createReservation, updateReservation, deleteReservation };
