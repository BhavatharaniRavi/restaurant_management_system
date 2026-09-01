const Table = require("../models/Table");

const getTables = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
    const tables = await Table.find(filter).sort({ tableNumber: 1 });
    res.json({ tables });
  } catch (err) {
    next(err);
  }
};

const createTable = async (req, res, next) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({ table });
  } catch (err) {
    next(err);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json({ table });
  } catch (err) {
    next(err);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json({ message: "Table deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTables, createTable, updateTable, deleteTable };
