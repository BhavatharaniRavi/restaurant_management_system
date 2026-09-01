const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Notification = require("../models/Notification");

// @desc   Place a new order
// @route  POST /api/orders
// @access Private
const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, orderType, tableId } = req.body;

    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "restaurantId and at least one item are required" });
    }

    // Re-fetch authoritative prices/names from the database rather than trusting the client
    const menuItemIds = items.map((i) => i.menuItemId);
    const dbItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    const dbItemMap = new Map(dbItems.map((d) => [d._id.toString(), d]));

    const orderItems = [];
    let totalAmount = 0;

    for (const reqItem of items) {
      const dbItem = dbItemMap.get(reqItem.menuItemId);
      if (!dbItem) {
        return res.status(404).json({ message: `Menu item ${reqItem.menuItemId} not found` });
      }
      if (!dbItem.available) {
        return res.status(400).json({ message: `${dbItem.name} is currently unavailable` });
      }
      const quantity = Math.max(1, parseInt(reqItem.quantity, 10) || 1);
      orderItems.push({
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity,
      });
      totalAmount += dbItem.price * quantity;
    }

    const order = await Order.create({
      userId: req.user._id,
      restaurantId,
      items: orderItems,
      orderType: orderType || "takeaway",
      tableId: tableId || null,
      totalAmount,
      status: "placed",
      paymentStatus: "pending",
    });

    await Notification.create({
      userId: req.user._id,
      message: `Your order #${order._id.toString().slice(-6)} has been placed successfully.`,
      type: "order-update",
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

// @desc   Get orders (own orders for customers, all/filtered for admin)
// @route  GET /api/orders
// @access Private
const getOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role !== "admin") {
      filter.userId = req.user._id;
    } else {
      if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
      if (req.query.status) filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate("restaurantId", "name")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single order by ID (for tracking)
// @route  GET /api/orders/:id
// @access Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurantId", "name address")
      .populate("userId", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.userId._id.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// @desc   Update order status — Admin only (progresses order through fulfilment lifecycle)
// @route  PUT /api/orders/:id/status
// @access Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["placed", "preparing", "ready", "served", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    await Notification.create({
      userId: order.userId,
      message: `Your order #${order._id.toString().slice(-6)} is now "${status}".`,
      type: "order-update",
    });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
