const mongoose = require("mongoose");

const dailySchema = new mongoose.Schema(
  {
    electricity: Number,
    transport: Number,
    plastic: Number,
    foodWaste: Number,
    goodDeed: String,
    carbon: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Daily", dailySchema);