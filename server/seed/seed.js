require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Restaurant.deleteMany({}),
    Category.deleteMany({}),
    MenuItem.deleteMany({}),
    Table.deleteMany({}),
  ]);

  console.log("Creating users...");
  const admin = await User.create({
    name: "Admin User",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "admin",
    phone: "9999999999",
  });

  const customer = await User.create({
    name: "Jane Customer",
    email: "customer@example.com",
    password: "customer123",
    role: "customer",
    phone: "8888888888",
  });

  console.log("Creating restaurant...");
  const restaurant = await Restaurant.create({
    name: "The Spice Route",
    description: "A cozy multi-cuisine restaurant offering the best of Indian, Chinese, and Continental cuisine.",
    cuisine: "Multi-Cuisine",
    address: "12 MG Road, Bengaluru, India",
    openingHours: { open: "10:00", close: "23:00" },
    rating: 4.3,
    owner: admin._id,
  });

  console.log("Creating categories...");
  const [starters, mains, desserts, beverages] = await Category.create([
    { restaurantId: restaurant._id, name: "Starters" },
    { restaurantId: restaurant._id, name: "Main Course" },
    { restaurantId: restaurant._id, name: "Desserts" },
    { restaurantId: restaurant._id, name: "Beverages" },
  ]);

  console.log("Creating menu items...");
  await MenuItem.create([
    { restaurantId: restaurant._id, categoryId: starters._id, name: "Paneer Tikka", description: "Grilled cottage cheese marinated in spices", price: 220, isVeg: true },
    { restaurantId: restaurant._id, categoryId: starters._id, name: "Chicken Seekh Kebab", description: "Minced chicken skewers grilled to perfection", price: 260, isVeg: false },
    { restaurantId: restaurant._id, categoryId: mains._id, name: "Butter Chicken", description: "Creamy tomato-based chicken curry", price: 320, isVeg: false },
    { restaurantId: restaurant._id, categoryId: mains._id, name: "Dal Makhani", description: "Slow-cooked black lentils in butter and cream", price: 240, isVeg: true },
    { restaurantId: restaurant._id, categoryId: mains._id, name: "Veg Fried Rice", description: "Wok-tossed rice with fresh vegetables", price: 200, isVeg: true },
    { restaurantId: restaurant._id, categoryId: desserts._id, name: "Gulab Jamun", description: "Deep-fried milk dumplings in sugar syrup", price: 120, isVeg: true },
    { restaurantId: restaurant._id, categoryId: beverages._id, name: "Masala Chai", description: "Spiced Indian tea", price: 60, isVeg: true },
    { restaurantId: restaurant._id, categoryId: beverages._id, name: "Fresh Lime Soda", description: "Refreshing lime soda, sweet or salted", price: 80, isVeg: true },
  ]);

  console.log("Creating tables...");
  const tableData = [];
  for (let i = 1; i <= 10; i++) {
    tableData.push({
      restaurantId: restaurant._id,
      tableNumber: i,
      capacity: i <= 6 ? 4 : 6,
    });
  }
  await Table.create(tableData);

  console.log("\nSeed complete!");
  console.log("-----------------------------------------");
  console.log("Admin login:    admin@restaurant.com / admin123");
  console.log("Customer login: customer@example.com / customer123");
  console.log("-----------------------------------------");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
