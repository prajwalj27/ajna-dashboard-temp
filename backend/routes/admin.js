const express = require("express");
const router = express.Router();
const config = require("config");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { AdminSignUpValidation } = require("../validator");
const moment = require("moment");
const { getAllAdmin, addAdmin, deleteAdmin } = require("../controllers/admin");

// @route    GET api/admin
// @desc     Get all Admin
// @access   private
router.get("/", auth, getAllAdmin);

// @route    POST api/admin
// @desc     add new Admin
// @access   public
router.post("/", AdminSignUpValidation, addAdmin);

// @route    DELETE api/admin
// @desc     delete Admin via mail id
// @access   private
router.delete("/:email", auth, deleteAdmin);

module.exports = router;
