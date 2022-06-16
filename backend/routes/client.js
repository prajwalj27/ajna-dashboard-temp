const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { ClientPasswordValidator } = require("../validator/index");
const {
  getAllClient,
  getSpecificClient,
  getallClient,
  registerClient,
  changeClientPassword,
  deleteClient,
} = require("../controllers/client");

// @route    GET api/clients
// @desc     Get all clients
// @access   Public
// 1
router.get("/", auth, getAllClient);

// @route    GET api/clients/:id
// @desc     Get current profile by id
// @access   Private
// 2
router.get("/:id", auth, getSpecificClient);

// @route POST api/clients
// @desc Register Client
// access Public
// 3
router.post("/", registerClient);

// @route    DELETE api/clients/:client_id
// @desc     delete client by client ID
// @access   Public
// 4
router.delete("/:id", deleteClient);

// @route GET api/clients/all
// @desc get all Client
// access Private
// 5
router.post("/all", auth, getallClient);

// @route PUT api/clients/clientid
// @desc Change Password User/Client
// access Public
// 6
router.put("/:id", ClientPasswordValidator, changeClientPassword);

module.exports = router;
