const express = require("express");
const router = express.Router();
const Heatmap = require("../models/Heatmap");
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const {
  insertData,
  dateBaseData,
  updatePathTracking,
  MonthBasedData,
  deleteObj,
} = require("../controllers/pathTracking");

// @route    POST api/pathTracking
// @desc     Post pathTracking of client
// @access   public
router.post("/", insertData);

// @route    POST api/path-tracking/dates/:id/:type
// @desc     Post camera and get heatmap of client
// @access   public
router.post("/dates/:id/:type", auth, dateBaseData);

// @route    Patch api/pathTracking
// @desc     add coordinates /update array with new timestamp
// @access   public
router.patch("/", updatePathTracking);

// @route    GET api/pathTracking/month
// @desc     get monthly impressions /month/clientID
// @access   public
router.get("/month/:id/:type", auth, MonthBasedData);

// @route    DELETE api/pathTracking/:id
// @desc    DELETE path tracking object
// @access   public
router.delete("/:id", deleteObj);
module.exports = router;
