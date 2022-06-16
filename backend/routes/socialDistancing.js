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
  getSocialDistancingData,
  getCount,
  deleteObj,
  getImage,
  todayData,
  AddNewData,
  getTodayCoordinates,
  getDistinctCamera,
  getDateBasedData,
} = require("../controllers/socialDistancing");

// @route    GET api/social-distancing/count
// @desc     Get social-distancing of client
// @access   public
router.post("/count/:id/:type", getCount);

// @route    GET api/social-distancing/me/:id
// @desc     Get social-distancing of client
// @access   private
router.post("/me/:id/:type", auth, getSocialDistancingData);

// @route    DELETE api/social-distancing/:objid
// @desc     delete obj by obj ID
// @access   Public
router.delete("/:id", deleteObj);

// @route    GET api/social-distancing/image
// @desc     Get social-distancing image
// @access   private
router.get("/img/:id", auth, getImage);

// @route    POST api/socialDistancing/metoday
// @desc     GET socialDistancing today data of client
// @access   private
router.post("/metoday/:id/:type", todayData);

// @route    Post api/social-distancing
// @desc     add social-distancing of client
// @access   public
router.post("/", AddNewData);

// @route    POST api/social-distancing/today/id
// @desc     Get social-distancing today coordinates based on zones of client
// @access   private
router.post("/today/:id/:type", auth, getTodayCoordinates);

// @route    POST api/social-distancing/cameraId/:id
// @desc     Get social-distancing distinct camera
// @access   public
router.get("/cameraId/:id", getDistinctCamera);

// @route    POST api/social-distancing/dates/:id/:type
// @desc     Get dates based data
// @access   public
router.post("/dates/:id/:type", auth, DateValidator, getDateBasedData);
module.exports = router;
