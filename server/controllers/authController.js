const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc   Register a new customer (or admin, if role explicitly provided and allowed)
// @route  POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, phone, address, role: "customer" });
    const token = generateToken(user._id, user.role);

    res.status(201).json({ user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @desc   Authenticate user and return token
// @route  POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.json({ user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @desc   Get current logged-in user's profile
// @route  GET /api/auth/me
// @access Private
const getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

// @desc   Update current user's profile
// @route  PUT /api/auth/me
// @access Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile };
