const DailyLog = require("../models/DailyLog");
const TrackerEntry = require("../models/TrackerEntry");

// ========== AI SUGGESTION LOGIC ==========

const generateSuggestions = (category, data) => {
  const suggestions = [];

  if (category === "Food Wastage") {
    const qty = data.quantity || 0;
    suggestions.push("Store leftovers in airtight containers");
    if (qty > 0.5) suggestions.push("Reduce portion sizes");
    suggestions.push("Compost food scraps");
  } else if (category === "Carbon Footprint") {
    const mode = data.travelMode;
    if (mode === "car") {
      suggestions.push("Try carpooling or public transport");
      suggestions.push("Use bike for short distances");
    } else if (mode === "public_transport") {
      suggestions.push("Great choice! Keep using public transport");
    }
    suggestions.push("Walk or cycle for distances under 5km");
  } else if (category === "Electricity Usage") {
    suggestions.push("Switch to LED bulbs");
    suggestions.push("Turn off devices when not in use");
    if (data.units > 5) suggestions.push("Use energy-efficient appliances");
  }

  return suggestions.slice(0, 3);
};

// Calculate prediction based on inputs
const calculateCO2 = (category, data) => {
  if (category === "Food Wastage") {
    return (data.quantity || 0) * 2.5; // 1kg food = 2.5kg CO2
  } else if (category === "Carbon Footprint") {
    const factors = {
      car: 0.21,
      bike: 0.1,
      public_transport: 0.05,
    };
    const factor = factors[data.travelMode] || 0.1;
    return ((data.distance || 0) * factor).toFixed(2);
  } else if (category === "Electricity Usage") {
    return ((data.units || 0) * 0.5).toFixed(2); // 1kWh = 0.5kg CO2
  }
  return 0;
};

const categorizeImpact = (category, data) => {
  if (category === "Food Wastage") {
    const qty = data.quantity || 0;
    if (qty > 1) return "HIGH";
    if (qty > 0.5) return "MEDIUM";
    return "LOW";
  } else if (category === "Carbon Footprint") {
    const dist = data.distance || 0;
    if (dist > 50) return "HIGH";
    if (dist > 10) return "MEDIUM";
    return "LOW";
  } else if (category === "Electricity Usage") {
    const units = data.units || 0;
    if (units > 10) return "HIGH";
    if (units > 5) return "MEDIUM";
    return "LOW";
  }
  return "MEDIUM";
};

// ========== GOOD WORK LOG ENDPOINTS ==========

exports.addGoodWorkLog = async (req, res) => {
  try {
    const { userId, title, tag, description, date } = req.body;

    if (!userId || !title || !tag) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse date - use provided date or default to today
    let logDate = new Date();
    if (date) {
      logDate = new Date(date);
    }
    // Normalize to start of day (00:00:00) for consistent date-based queries
    logDate = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());

    const log = new DailyLog({
      userId,
      title,
      tag,
      description,
      date: logDate,
      value: 0,
    });

    await log.save();

    res.status(201).json({
      message: "Good work logged!",
      log,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGoodWorkLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await DailyLog.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      message: "Good work logs retrieved",
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== TODAY'S TRACKER ENDPOINTS ==========

exports.trackActivity = async (req, res) => {
  try {
    const { userId, category, quantity, travelMode, distance, units, date } =
      req.body;

    if (!userId || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse date - use provided date or default to today
    let entryDate = new Date();
    if (date) {
      entryDate = new Date(date);
    }
    // Normalize to start of day for consistent date-based queries
    entryDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

    const data = {
      quantity,
      travelMode,
      distance,
      units,
    };

    const suggestions = generateSuggestions(category, data);
    const estimatedCO2 = calculateCO2(category, data);
    const impactLevel = categorizeImpact(category, data);

    const entry = new TrackerEntry({
      userId,
      category,
      quantity,
      travelMode,
      distance,
      units,
      date: entryDate,
      estimatedCO2,
      impactLevel,
      suggestions,
    });

    await entry.save();

    res.status(201).json({
      message: "Activity tracked successfully",
      entry,
      suggestions,
      impactLevel,
      estimatedCO2,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activities = await TrackerEntry.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1 });

    res.status(200).json({
      message: "Today's activities retrieved",
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== WEEKLY ANALYZER ENDPOINTS ==========

exports.getWeeklyStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trackerEntries = await TrackerEntry.find({
      userId,
      date: { $gte: sevenDaysAgo },
    });

    const totalCO2 = trackerEntries.reduce(
      (sum, entry) => sum + parseFloat(entry.estimatedCO2 || 0),
      0
    );

    const impactCounts = {
      HIGH: trackerEntries.filter((e) => e.impactLevel === "HIGH").length,
      MEDIUM: trackerEntries.filter((e) => e.impactLevel === "MEDIUM").length,
      LOW: trackerEntries.filter((e) => e.impactLevel === "LOW").length,
    };

    const categoryBreakdown = {};
    trackerEntries.forEach((entry) => {
      categoryBreakdown[entry.category] =
        (categoryBreakdown[entry.category] || 0) +
        parseFloat(entry.estimatedCO2 || 0);
    });

    res.status(200).json({
      message: "Weekly stats retrieved",
      totalCO2: totalCO2.toFixed(2),
      impactCounts,
      categoryBreakdown,
      totalActivities: trackerEntries.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== GROUPED BY DATE FOR WEEKLY VIEW ==========

exports.getActivitiesByDay = async (req, res) => {
  try {
    const { userId } = req.params;

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const trackerEntries = await TrackerEntry.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    const goodWorkLogs = await DailyLog.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    // Group by date
    const groupedByDate = {};

    trackerEntries.forEach((entry) => {
      const dateKey = new Date(entry.date).toLocaleDateString();
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { tracker: [], logs: [] };
      }
      groupedByDate[dateKey].tracker.push(entry);
    });

    goodWorkLogs.forEach((log) => {
      const dateKey = new Date(log.date).toLocaleDateString();
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { tracker: [], logs: [] };
      }
      groupedByDate[dateKey].logs.push(log);
    });

    res.status(200).json({
      message: "Activities grouped by date",
      data: groupedByDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
