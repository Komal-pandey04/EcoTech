const mongoose = require("mongoose");

const TrackerEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Food Wastage", "Carbon Footprint", "Electricity Usage"],
      required: true,
    },
    // Food Wastage fields
    quantity: {
      type: Number,
      default: 0,
      description: "kg of food wasted",
    },
    // Carbon Footprint fields
    travelMode: {
      type: String,
      enum: ["car", "bike", "public_transport"],
      default: null,
    },
    distance: {
      type: Number,
      default: 0,
      description: "km traveled",
    },
    // Electricity fields
    units: {
      type: Number,
      default: 0,
      description: "kWh consumed",
    },
    // AI Analysis
    estimatedCO2: {
      type: Number,
      default: 0,
      description: "kg CO2 emitted",
    },
    impactLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    suggestions: {
      type: [String],
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackerEntry", TrackerEntrySchema);
