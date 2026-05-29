const mongoose = require("mongoose");

const dailyEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Section 1: User Action Log
    title: {
      type: String,
      required: true,
    },
    description: String,

    // Section 2: Tracking + AI
    category: {
      type: String,
      enum: ["food_wastage", "carbon_footprint", "electricity_usage"],
      required: true,
    },

    // Dynamic inputs based on category
    inputs: {
      // For food_wastage
      foodWasteAmount: Number, // kg
      mealType: String, // breakfast/lunch/dinner

      // For carbon_footprint
      travelMode: String, // car/bike/public_transport
      distance: Number, // km

      // For electricity_usage
      units: Number, // kWh
      applianceType: String,
    },

    // AI predictions and suggestions
    prediction: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
    },

    // Estimated impact
    estimatedCO2: Number, // kg CO2

    suggestions: [String], // Array of 2-3 suggestions

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyEntry", dailyEntrySchema);
