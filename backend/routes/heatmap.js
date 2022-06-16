const express = require("express");
const router = express.Router();
const Heatmap = require("../models/Heatmap");
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const {
  insertHeatmapData,
  DateBasedData,
  MonthBasedData,
} = require("../controllers/heatmap");

// @route    POST api/Heatmap
// @desc     post Heatmap of client
// @access   public
// 1
router.post("/", insertHeatmapData);

// @route    POST api/Heatmap/me
// @desc     Post camera and get heatmap of client
// @access   public
// 2
router.post("/dates/:id/:type", DateBasedData);

// @route    GET api/Heatmap/month
// @desc     get monthly impressions /month/clientID
// @access   public
// 3
router.get("/month/:id/:type", auth, MonthBasedData);
module.exports = router;
