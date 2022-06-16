const express = require("express");
const router = express.Router();
const FootfallAnalysis = require("../models/FootfallAnalysis");
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const { DateValidator } = require("../validator");
const {
  insertFootfallData,
  deletefootfallObject,
  updateFootfallData,
  getAllData,
  getWeeklyData,
  getTodayData,
  getDatesBasedChart,
  generatePdf,
  getTodayChart,
} = require("../controllers/footfallAnalysis");

// @route    POST /api/footfall-analysis
// @desc     Add new footfall Data
// @access   Public
// 1
router.post("/", insertFootfallData);

// @route    PATCH /api/footfall-analysis
// @desc     update when person cross Threshold
// @access   Public
// 2
router.patch("/:id", updateFootfallData);

// @route    GET /api/footfall-analysis/metoday/:id/:type
// @desc     get Today data with and without dates
// @access   Public
// 4
router.get("/metoday/:id/:type", getTodayData);

// @route    GET /api/footfall-analysis/all/:id/:type
// @desc     get all today's data if date is not given
// @access   Public
// 8
router.get("/all/:id/:type", getAllData);

// @route    DELETE /api/footfall-analysis/:id
// @desc     delete Specific Object
// @access   Public
// 3
router.delete("/:id", deletefootfallObject);

// @route    POST /api/footfall-analysis/weekly/:id/:type
// @desc     post camera and get weekly data
// @access   Public
// 5
router.get("/weekly/:id/:type", auth, getWeeklyData);

// @route    GET /api/footfall-analysis/today/:id/:type
// @desc     get today data for chart
// @access   Private
// 9
router.get("/today/:id/:type", auth, getTodayChart);

// @route    POST /api/footfall-analysis/dates/:id/:type
// @desc     post camera and get today date selected chart data
// @access   Private
// 10
router.post("/dates/:id/:type", auth, DateValidator, getDatesBasedChart);

router.post("/create-pdf", generatePdf);
module.exports = router;
