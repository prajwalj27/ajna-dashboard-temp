const express = require("express");
const router = express.Router();
const Heatmap = require("../models/Heatmap");
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");
const {
  Weekly,
  getData,
  getPathTrackingHourBased,
  getPathTrackingWeekBased,
  getPathTrackingMonthBased,
  getDwellTimeHourBased,
  getDwellTimeWeekBased,
  getDwellTimeMonthBased,
  heatmapPdf,
  pathTrackPdf,
  pdfMailSend,
} = require("../controllers/pdfapi");

// @route    Get api/pdf/:id
// @desc     Get weekly
// @access   public
router.get("/:id", auth, getData);

// @route    GET api/pdf/footfallhourbased/:clientId/:branchId
// @desc     get footfallhourbased
// @access   public
router.get(
  "/footfallhourbased/:clientId/:branchId",
  auth,
  getPathTrackingHourBased
);

// @route    GET api/pdf/footfallweekbased/:clientId/:branchId
// @desc     get footfallweekbased
// @access   public
router.get(
  "/footfallweekbased/:clientId/:branchId",
  auth,
  getPathTrackingWeekBased
);

// @route    GET api/pdf/footfallmonthbased/:clientId/:branchId
// @desc     get footfallmonthbased
// @access   public
router.get(
  "/footfallmonthbased/:clientId/:branchId",
  auth,
  getPathTrackingMonthBased
);

// @route    GET api/pdf/dwellTimehourbased/:clientId/:branchId
// @desc     get dwellTimehourbased
// @access   public
router.get(
  "/dwellTimehourbased/:clientId/:branchId",
  auth,
  getDwellTimeHourBased
);

// @route    GET api/pdf/dwellTimeweekbased/:clientId/:branchId
// @desc     get dwellTimeweekbased
// @access   public
router.get(
  "/dwellTimeweekbased/:clientId/:branchId",
  auth,
  getDwellTimeWeekBased
);

// @route    GET api/pdf/dwellTimemonthbased/:clientId/:branchId
// @desc     get dwellTimemonthbased
// @access   public
router.get(
  "/dwellTimemonthbased/:clientId/:branchId",
  auth,
  getDwellTimeMonthBased
);

// @route    POST api/pdf/heatmap/:branchId
// @desc     get heatmap
// @access   public
router.post("/heatmap/:branchId", heatmapPdf);

// @route    POST api/pdf/pathtracking/:branchId
// @desc     get pathtracking
// @access   public
router.post("/pathtracking/:branchId", pathTrackPdf);

router.post("/mailsender", pdfMailSend);
router.post("/weekly/:id", auth, Weekly);

module.exports = router;
