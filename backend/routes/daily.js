const express = require("express");
const router = express.Router();
const {
  addGoodWorkLog,
  getGoodWorkLogs,
  trackActivity,
  getTodayActivities,
  getWeeklyStats,
  getActivitiesByDay,
} = require("../controllers/dailyController");

// GOOD WORK LOG ROUTES
router.post("/log", addGoodWorkLog);
router.get("/logs/:userId", getGoodWorkLogs);

// TODAY'S TRACKER ROUTES
router.post("/track", trackActivity);
router.get("/today/:userId", getTodayActivities);

// WEEKLY STATS ROUTES
router.get("/stats/:userId", getWeeklyStats);
router.get("/week/:userId", getActivitiesByDay);

module.exports = router;