const express = require("express");
const router = express.Router();
const Heatmap = require("../models/Heatmap");
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const {
  getTodayBranchNotifications,
  getWeeklyBranchNotification,
} = require("../controllers/notifications");

// @route    Get api/notification/today/:branchId/:cameraId
// @desc     Get monthly notifications
// @access   private
router.get("/today", auth, getTodayBranchNotifications);

// @route    Get api/notification/weekly/:branchId/:cameraId
// @desc     Get monthly notifications
// @access   private
router.get("/weekly", auth, getWeeklyBranchNotification);

module.exports = router;
