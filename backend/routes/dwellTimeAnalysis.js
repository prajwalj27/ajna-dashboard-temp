const express = require("express");
const router = express.Router();
const DwellTimeAnalysis = require("../models/DwellTimeAnalysis");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");
const moment = require("moment");
const {
  insertDwellTimeData,
  deleteDwellTimeObject,
  updatePersonThreshold,
  getDwellTimeData,
  getWeeklyData,
  getTodayData,
  todayPasserBy,
  getMaxMinAvg,
  getPdfData,
} = require("../controllers/dwellTimeAnalysis");

// @route    POST /api/dwell-time-analysis
// @desc     Add new dwellTime Data
// @access   Public
// 1
router.post("/", insertDwellTimeData);

// @route    PATCH /api/dwell-time-analysis
// @desc     update when person cross Threshold
// @access   Public
// 2
router.patch("/:id/:personId", updatePersonThreshold);

// @route    DELETE /api/dwell-time-analysis/:id
// @desc     delete Specific Object
// @access   Public
// 3
router.delete("/:id", deleteDwellTimeObject);

// @route    POST /api/dwell-time-analysis/me/:id
// @desc     post camera and get data with and without dates
// @access   Public
// 4
router.post("/me/:id", auth, getDwellTimeData);

// @route    GET /api/dwell-time-analysis/weekly/:id/:type
// @desc     Get weekly data
// @access   Public
// 5
router.get("/weekly/:id/:type", auth, getWeeklyData);

// @route    GET /api/dwell-time-analysis/todayme/:id/:type
// @desc     Get today's data
// @access   Public
// 6
router.get("/todayme/:id/:type", auth, getTodayData);

// @route    GET /api/dwell-time-analysis/todayparserby/:id/:type
// @desc     Get /todayparserby/:id/:type
// @access   Public
// 7
router.get("/todayparserby/:id/:type", auth, todayPasserBy);

// @route    GET /api/dwell-time-analysis/maxmin/:id/:type
// @desc     Get max,min,avg value
// @access   Public
// 8
router.get("/maxmin/:id/:type", auth, getMaxMinAvg);

// @route    POST /api/dwell-time-analysis/pdf/:id
// @desc     post camera and get pdf
// @access   Public
// 8
router.post("/pdf/:id", getPdfData);
module.exports = router;
