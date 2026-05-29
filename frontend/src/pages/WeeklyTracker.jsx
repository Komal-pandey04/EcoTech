import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";

const WeeklyTracker = () => {
  const navigate = useNavigate();
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  // Get user ID
  const userId = (() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user)?.id : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (userId) {
      fetchWeeklyData();
    }
  }, [userId]);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/weekly/report/${userId}`);
      console.log("Weekly data response:", response.data);
      setWeeklyData(response.data);
      
      // Prepare chart data from report
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      
      const chartDataFormatted = days.map((day) => ({
        name: day.slice(0, 3),
        co2: parseFloat(response.data.reportByDay[day]?.totalCO2?.toFixed(2) || 0),
        activities:
          (response.data.reportByDay[day]?.trackerActivities?.length || 0) +
          (response.data.reportByDay[day]?.goodWorkLogs?.length || 0),
      }));
      
      setChartData(chartDataFormatted);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center mt-20">
          <Leaf className="w-12 h-12 text-green-600 animate-bounce mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">
            Loading your weekly report...
          </p>
        </div>
      </div>
    );
  }

  // ========== EMPTY STATE ==========
  if (
    !weeklyData ||
    weeklyData.overallStats?.totalActivities === 0
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-white">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-20 mt-20">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-md">
              {/* Illustration */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full blur-3xl opacity-20"></div>
                  <Leaf className="w-32 h-32 text-green-600 relative" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                No Data Yet 🌱
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Start tracking your daily activities to see your weekly impact
                and build sustainable habits.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/daily")}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg mb-12"
              >
                <span>Start Tracking</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-4 mt-16">
                <div className="bg-white/70 backdrop-blur border border-green-100 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition">
                  <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900">
                    Track Daily
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Log activities</p>
                </div>
                <div className="bg-white/70 backdrop-blur border border-green-100 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900">
                    View Impact
                  </p>
                  <p className="text-xs text-gray-500 mt-1">See progress</p>
                </div>
                <div className="bg-white/70 backdrop-blur border border-green-100 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900">Get Tips</p>
                  <p className="text-xs text-gray-500 mt-1">AI insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== DATA STATE ==========
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const stats = weeklyData.overallStats || {};

  const COLORS = [
    "#10b981",
    "#059669",
    "#047857",
    "#065f46",
    "#064e3b",
    "#022c22",
    "#021514",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-20 mt-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Weekly Report
          </h1>
          <p className="text-xl text-gray-600">
            Your environmental impact at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Activities */}
          <div className="bg-white rounded-2xl border-2 border-green-100 p-8 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Activities
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {stats.totalActivities || 0}
                </p>
              </div>
              <Activity className="w-12 h-12 text-green-100" />
            </div>
          </div>

          {/* Total CO₂ */}
          <div className="bg-white rounded-2xl border-2 border-blue-100 p-8 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total CO₂
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  {stats.totalCO2 || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">kg</p>
              </div>
              <Zap className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          {/* Daily Average */}
          <div className="bg-white rounded-2xl border-2 border-purple-100 p-8 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Daily Avg
                </p>
                <p className="text-4xl font-bold text-purple-600">
                  {stats.averageDailyEmissions || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">kg CO₂</p>
              </div>
              <TrendingDown className="w-12 h-12 text-purple-100" />
            </div>
          </div>

          {/* Best Day */}
          <div className="bg-white rounded-2xl border-2 border-amber-100 p-8 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Best Day
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.bestDay || "—"}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-amber-100" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* CO2 Emissions Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Daily CO₂ Emissions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="co2" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Count Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Activities per Day
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="activities"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: "#059669", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Daily Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b-2 border-green-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Day
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Good Work Logs
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Tracked Activities
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    CO₂ Emissions (kg)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Total Activities
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((day, idx) => {
                  const dayData = weeklyData.reportByDay?.[day] || {};
                  const goodWorkCount = dayData.goodWorkLogs?.length || 0;
                  const trackerCount = dayData.trackerActivities?.length || 0;
                  const totalActivities = goodWorkCount + trackerCount;
                  const co2 = dayData.totalCO2?.toFixed(2) || "0.00";

                  return (
                    <tr
                      key={day}
                      className={`border-b border-gray-100 hover:bg-green-50 transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {day}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {goodWorkCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {trackerCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {co2}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600 text-lg">
                          {totalActivities}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Details - Improved Grid Cards */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Activity Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {days.map((day) => {
              const dayData = weeklyData.reportByDay?.[day] || {};
              const hasData =
                (dayData.goodWorkLogs?.length || 0) +
                  (dayData.trackerActivities?.length || 0) >
                0;

              return (
                <div
                  key={day}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-[280px] flex flex-col"
                >
                  {/* Card Header */}
                  <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                    <h3 className="font-bold text-gray-900">
                      {day}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {(dayData.goodWorkLogs?.length || 0) + (dayData.trackerActivities?.length || 0)} activities
                    </p>
                  </div>

                  {/* Card Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    {!hasData ? (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        <p className="text-sm text-center">No activities</p>
                      </div>
                    ) : (
                      <>
                        {/* Good Work Logs */}
                        {dayData.goodWorkLogs?.length > 0 && (
                          <div className="space-y-2">
                            {dayData.goodWorkLogs.map((log, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-green-50 p-2.5 rounded border border-green-200 hover:border-green-300 transition"
                              >
                                <p className="font-semibold text-green-900 truncate">
                                  {log.tag}
                                </p>
                                <p className="text-green-700 text-xs mt-0.5 line-clamp-2">
                                  {log.title}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tracked Activities */}
                        {dayData.trackerActivities?.length > 0 && (
                          <div className="space-y-2">
                            {dayData.trackerActivities.map((activity, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-blue-50 p-2.5 rounded border border-blue-200 hover:border-blue-300 transition"
                              >
                                <p className="font-semibold text-blue-900 truncate">
                                  {activity.category}
                                </p>
                                <p className="text-blue-700 text-xs mt-0.5">
                                  CO₂: {activity.estimatedCO2}kg
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTracker;