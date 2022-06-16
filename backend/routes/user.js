const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  ClientPasswordValidator,
  CameraStatusValidator,
} = require("../validator/index");
const {
  getAllUser,
  getUsersSpecificClient,
  getUsersSpecificUserId,
  registerUser,
  deleteUser,
  editUser,
  getCameraStatus,
  changeUserPassword,
  updateCameraStatus,
} = require("../controllers/user");

// @route    GET api/users
// @desc     Get all users
// @access   Public
// 1
router.get("/", getAllUser);

// @route    GET api/users/employeeid
// @desc     Get all user of specific client
// @access   Public
// 2
router.get("/:id", auth, getUsersSpecificClient);

// @route    GET api/users/me/id
// @desc     Get user via employeeid
// @access   Public
// 3
router.get("/me/:id", getUsersSpecificUserId);

// @route POST api/users
// @desc Register User
// access Public
router.post("/", registerUser);

// @route    DELETE api/users/:user_id
// @desc     delete user by user ID
// @access   Public
router.delete("/:id", deleteUser);

// @route post api/users/edituser
// @desc update User
// access Public
router.post("/edituser", editUser);

// @route PUT api/users/clientid
// @desc Change Password User/Client
// access Public
router.put("/:id", ClientPasswordValidator, changeUserPassword);

// @route PATCH api/users/cameraStatus/:id
// @desc Update Camera Status
// access Public
router.patch("/cameraStatus/:id", CameraStatusValidator, updateCameraStatus);

// @route GET api/users/cameraStatus/:id
// @desc Get Camera Status
// access Public
router.get("/getCameraStatus/:id", getCameraStatus);

module.exports = router;
