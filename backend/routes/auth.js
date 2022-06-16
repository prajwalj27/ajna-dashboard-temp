const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { SigninValidator } = require("../validator/index");
const {
  adminSignin,
  clientSignin,
  userSignin,
  isAuthenticate,
  userSigninAndRedirect
} = require("../controllers/auth");

// @route GET api/auth
// @desc Test route
// access private
// 1
router.get("/", auth, isAuthenticate);

// @route POST api/auth/admin
// @desc Authenticate admin & get Token/login
// access Public
// 2
router.post("/admin", SigninValidator, adminSignin);

// @route POST api/auth/client
// @desc Authenticate client & get Token/login
// access Public
// 3
router.post("/client", SigninValidator, clientSignin);

// @route POST api/auth
// @desc Authenticate user & get Token/login
// access Public
// 4
router.post("/", SigninValidator, userSignin);

// @route POST api/auth/redirect/?data=<rsa_encrypted_data>
// @desc Decrypt the data, then authenticate user & get Token/login
// access Public
// 4
router.get("/redirect/*", userSigninAndRedirect);

module.exports = router;
