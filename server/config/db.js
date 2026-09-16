const mongoose = require("mongoose");
const dns = require("dns");

// Use reliable public DNS servers for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/restaurant_system";

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;