const express = require("express");
const router = express.Router();
const {
  getWeeklyReport,
  getWeeklyComparison,
  getCategoryBreakdown,
} = require("../controllers/weeklyController");

// GET /api/weekly/report/:userId - Get weekly report grouped by day
router.get("/report/:userId", getWeeklyReport);

// GET /api/weekly/comparison/:userId - Compare with previous week
router.get("/comparison/:userId", getWeeklyComparison);

// GET /api/weekly/breakdown/:userId - Get category breakdown
router.get("/breakdown/:userId", getCategoryBreakdown);

module.exports = router;