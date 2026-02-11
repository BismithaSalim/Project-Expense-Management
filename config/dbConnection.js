const config = require("./config.js");
const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(config["dbUrl"]);
    console.log("Database Connected");
  } catch (err) {
    console.log("Database connection error:", err);
    throw err;
  }
};

module.exports = {
  connectDatabase,
};
