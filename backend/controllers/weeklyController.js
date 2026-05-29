const TrackerEntry = require("../models/TrackerEntry");
const DailyLog = require("../models/DailyLog");

// Get activities grouped by day of week
exports.getWeeklyReport = async (req, res) => {
  try {
    const { userId } = req.params;

    // Last 7 days (normalized)
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

    // Group by day
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const reportByDay = {};

    days.forEach((day) => {
      reportByDay[day] = {
        trackerActivities: [],
        goodWorkLogs: [],
        totalCO2: 0,
        highImpactCount: 0,
      };
    });

    trackerEntries.forEach((entry) => {
      const day = days[new Date(entry.date).getDay()];
      reportByDay[day].trackerActivities.push(entry);
      reportByDay[day].totalCO2 += parseFloat(entry.estimatedCO2 || 0);
      if (entry.impactLevel === "HIGH") {
        reportByDay[day].highImpactCount++;
      }
    });

    goodWorkLogs.forEach((log) => {
      const day = days[new Date(log.date).getDay()];
      reportByDay[day].goodWorkLogs.push(log);
    });

    // Calculate overall stats
    const totalCO2 = trackerEntries.reduce(
      (sum, entry) => sum + parseFloat(entry.estimatedCO2 || 0),
      0
    );

    const bestDay = Object.keys(reportByDay).reduce((prev, curr) => {
      const currCount = reportByDay[curr].trackerActivities.length + reportByDay[curr].goodWorkLogs.length;
      const prevCount = reportByDay[prev].trackerActivities.length + reportByDay[prev].goodWorkLogs.length;
      return currCount > prevCount ? curr : prev;
    }, days[0]);

    // Total activities = tracker entries + good work logs
    const totalActivities = trackerEntries.length + goodWorkLogs.length;

    res.status(200).json({
      message: "Weekly report retrieved",
      reportByDay,
      overallStats: {
        totalCO2: totalCO2.toFixed(2),
        totalActivities: totalActivities,
        bestDay,
        averageDailyEmissions: totalActivities > 0 ? (totalCO2 / 7).toFixed(2) : "0.00",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comparison with previous week
exports.getWeeklyComparison = async (req, res) => {
  try {
    const { userId } = req.params;

    // Current week (last 7 days)
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);

    // Previous week (14-7 days ago)
    const previousWeekStart = new Date();
    previousWeekStart.setDate(previousWeekStart.getDate() - 14);
    const previousWeekEnd = new Date();
    previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);

    const currentWeekEntries = await TrackerEntry.find({
      userId,
      date: { $gte: currentWeekStart },
    });

    const previousWeekEntries = await TrackerEntry.find({
      userId,
      date: { $gte: previousWeekStart, $lt: previousWeekEnd },
    });

    const currentCO2 = currentWeekEntries.reduce(
      (sum, entry) => sum + parseFloat(entry.estimatedCO2 || 0),
      0
    );

    const previousCO2 = previousWeekEntries.reduce(
      (sum, entry) => sum + parseFloat(entry.estimatedCO2 || 0),
      0
    );

    const improvement =
      previousCO2 > 0
        ? (((previousCO2 - currentCO2) / previousCO2) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      message: "Weekly comparison retrieved",
      currentWeekCO2: currentCO2.toFixed(2),
      previousWeekCO2: previousCO2.toFixed(2),
      improvementPercentage: improvement,
      trend: improvement > 0 ? "improving" : "needs improvement",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category breakdown for the week
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const { userId } = req.params;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await TrackerEntry.find({
      userId,
      date: { $gte: sevenDaysAgo },
    });

    const breakdown = {};

    entries.forEach((entry) => {
      if (!breakdown[entry.category]) {
        breakdown[entry.category] = {
          count: 0,
          totalCO2: 0,
          items: [],
        };
      }
      breakdown[entry.category].count++;
      breakdown[entry.category].totalCO2 += parseFloat(entry.estimatedCO2 || 0);
      breakdown[entry.category].items.push({
        date: entry.date,
        co2: entry.estimatedCO2,
        impact: entry.impactLevel,
      });
    });

    res.status(200).json({
      message: "Category breakdown retrieved",
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
