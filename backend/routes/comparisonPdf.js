const express = require("express");
const router = express.Router();
const DwellTimeAnalysis = require("../models/DwellTimeAnalysis");
const config = require("config");
const PathTracking = require("../models/PathTracking");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const {
  WeekVsWeekend,
  getFootfallZones,
  CompareZones,
} = require("../controllers/comparisonPdf");

// @route    POST /api/compare/footfallWeekVsWeenkend/:clientId/:branchId
// @desc     Compare Week vs Weekend
// @access   Public
// 1
router.post("/footfallWeekVsWeenkend/:clientId/:branchId", WeekVsWeekend);

// @route    Get /api/compare/footfallZones/:clientId/:branchId
// @desc     get all footfall Zones
// @access   Public
// 2
router.post("/footfallZones/:clientId/:branchId", getFootfallZones);

// @route    Get /api/compare
// @desc     compare different zones
// @access   Public
// 3

router.get("/zoneBased/:clientId/:firstbranch/:secondbranch", CompareZones);
module.exports = router;
