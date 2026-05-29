const mongoose = require("mongoose");

const DailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      example: "Planted a tree",
    },
    tag: {
      type: String,
      enum: [
        "Tree Plantation",
        "Energy Saving",
        "No Food Waste",
        "Low Carbon Activity",
        "Save Water",
        "Public Transport",
        "Save Electricity",
        "Tree Planting",
        "Composting",
      ],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    value: {
      type: Number,
      default: 0,
      description: "Optional metric value for the activity",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyLog", DailyLogSchema);
