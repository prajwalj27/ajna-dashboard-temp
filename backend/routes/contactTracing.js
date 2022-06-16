const express = require("express");
const router = express.Router();
const Heatmap = require("../models/Heatmap");
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const {
  getContactTracingData,
  getTodayGraphCoordinates,
  addNewData,
  getAllGraphCoordinates,
  getImage,
  distinctCamera,
} = require("../controllers/contactTracing");

// @route    GET api/contact-tracing/today/id
// @desc     Get contact-tracing taday graph cordinates
// @access   private
router.get("/today/:id", getTodayGraphCoordinates);

// @route    POST api/contact-tracing/all/id
// @desc     post camera and get contact-tracing graph cordinates
// @access   private
router.post("/all/:id/:type", auth, getAllGraphCoordinates);

// @route    POST api/contact-tracing
// @desc     POST contact-tracing of client
// @access   public
router.post("/", addNewData);

// @route    POST api/contact-tracing/me
// @desc     post camera and get contact-tracing of client
// @access   private
router.post("/me/:id/:type", auth, getContactTracingData);

// @route    GET api/contact-tracing/image
// @desc     Get contact-tracing image
// @access   private
router.get("/img/:id", auth, getImage);

router.get("/cameraId/:id", distinctCamera);
module.exports = router;
