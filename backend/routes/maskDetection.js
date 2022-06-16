const express = require("express");
const router = express.Router();
const Heatmap = require("../models/Heatmap");
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const { DateValidator } = require("../validator/index");
const {
  fetchingMaskDetectionData,
  fetchingDateBasedChart,
  todayCount,
  addNewData,
  CountDateBased,
  getWeeklyBasedData,
  getImage,
  getDistinctCamera,
} = require("../controllers/maskDetection");

// @route    GET api/maskDetection/me
// @desc     fetching maskDetection of client
// @access   private
router.get("/me/:id/:type", auth, fetchingMaskDetectionData);

// @route    POST api/maskDetection/count
// @desc     Get maskDetection count according to date selection of client
// @access   private
router.post("/countdata/:id/:type", auth, CountDateBased);

// @route    POST api/maskDetection/todayCount
// @desc     Get maskDetection todayCount data of client by postng camera
// @access   public
router.post("/todaycount/:id/:type", todayCount);

// @route    POST api/maskDetection
// @desc     add data of mask detection
// @access   public
router.post("/", addNewData);

function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

// @route    POST api/maskDetection/dates/:id/:type
// @desc     fetching date based chart data
// @access   private
router.post("/dates/:id/:type", auth, DateValidator, fetchingDateBasedChart);

// @route    GET api/maskDetection/weekly
// @desc     Get maskDetection weekly cordinates of client
// @access   private
router.post("/weekly/:id/:type", auth, getWeeklyBasedData);

// @route    GET api/maskDetection/image
// @desc     Get maskDetection image
// @access   private
router.get("/img/:id", auth, getImage);

// @route    GET api/maskDetection/distinctCameraId
// @desc     Get maskDetection distinct camera id
// @access   public
router.get("/cameraId/:id", getDistinctCamera);
module.exports = router;
