const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  MacAddressValidator,
  branchMacAddressValidator,
} = require("../validator/index");
const {
  addNewBranch,
  deleteBranch,
  AdminAcceptedBranches,
  getBranchViaBranchId,
  specificClientBranchesAcceptedByAdmin,
  branchConfiguration,
  allBranchesNotAcceptedByAdmin,
  changeBranchStatusByAdmin,
  changeMacAddress,
  UpdateConfigureZone,
  getConfigureZone,
  updateConfigureSocial,
  getConfigureSocial,
  getConfigurepath,
  updateConfigurepath,
  updateCameraImage,
  addCamera,
  deleteCamera,
  updateCamera,
  updateDevice,
  deleteDevice,
  getBranchCamera,
  getCameraImage,
  getCamera,
  addDevice,
  getDevice,
  getAllCamera,
  changeBranchMacAddress,
  getBranchZones,
  getCameraImagesViaBranchId,
  getBranchAlertConfig,
  updateBranchAlertConfig,
} = require("../controllers/branch");

// @route    POST api/branch
// @desc     Add new branch
// @access   Private
// 1
router.post("/", addNewBranch);
// @route    GET api/branch/accept
// @desc     Get branches which are accepted by admin(For admin home page)
// @access   Private
// 2
router.get("/accept", auth, AdminAcceptedBranches);

// @route    DELETE api/branch/branchId
// @desc     Delete branch via branchId
// @access   Public
// 3
router.delete("/:branchId", deleteBranch);

// @route    GET api/branch/me/:branchid
// @desc     Get branch data via branchId
// @access   Private
// 4
router.get("/me/:id", auth, getBranchViaBranchId);

// @route    GET api/branch/:id
// @desc     Client branches accepted by admin
// @access   Private
// 5
router.get("/:id", auth, specificClientBranchesAcceptedByAdmin);

// @route    GET api/branch
// @desc     branches not accepted by admin
// @access   Private
// 6
router.get("/", auth, allBranchesNotAcceptedByAdmin);

// @route    GET api/branch/allconfigure/:id
// @desc     configuration of specific branch
// @access   Public
// 7
router.get("/allconfigure/:id", branchConfiguration);

// @route    PUT api/branch/:id
// @desc     change branch status by admin
// @access   Private
// 8
router.put("/:id", auth, changeBranchStatusByAdmin);

// @route    PUT api/branch
// @desc     change mac address
// @access   Private
// 9
router.put("/", auth, MacAddressValidator, changeMacAddress);

// @route    POST api/branch/configurezone/:id
// @desc     update configurezone
// @access   Public
// 10
router.post("/configurezone/:id", UpdateConfigureZone);

// @route    GET api/branch/configurezone/:id
// @desc     get configurezone
// @access   Public
// 11
router.get("/configurezone/:id", getConfigureZone);

// @route   POST api/branch/configureSocial/:id
// @desc     update configureSocial
// @access   Public
// 12
router.post("/configureSocial/:id", updateConfigureSocial);

// @route   GET api/branch/configureSocial/:id
// @desc     get configureSocial
// @access   Public
// 13
router.get("/configureSocial/:id", getConfigureSocial);

// @route   POST api/branch/configurepath/:id
// @desc     update configurepath
// @access   Public
// 14
router.post("/configurepath/:id/:type", updateConfigurepath);

// @route   Get api/branch/configurepath/:id
// @desc     get configurepath
// @access   Public
// 15
router.get("/configurepath/:id/:type/:c_id", getConfigurepath);

// @route   POST api/branch/configure-image/:id
// @desc     update camera image
// @access   Public
// 16
router.post("/configure-image/:id/:type", updateCameraImage);

// @route   POST api/branch/camera/:id
// @desc     add camera
// @access   Public
// 17
router.post("/camera/:id", addCamera);

// @route   DELETE api/branch/camera/:id/:c_id
// @desc     delete camera
// @access   Public
// 18
router.delete("/camera/:id/:c_id", deleteCamera);

// @route   POST api/branch/updatecamera/:id/:c_id
// @desc     update camera
// @access   Public
// 19
router.post("/updatecamera/:id/:c_id", updateCamera);

// @route   POST api/branch/updateDevice/:id/:device_id
// @desc     update device
// @access   Public
// 20
router.post("/updatedevice/:id/:device_id", updateDevice);

// @route   DELETE api/branch/device/:id/:device_id
// @desc     delete device
// @access   Public
// 21
router.delete("/device/:id/:device_id", deleteDevice);

// @route   GET api/branch/camera/:id/:type
// @desc     Get Camera
// @access   Public
// 22
router.get("/camera/:id/:type", getBranchCamera);

// @route   GET api/branch/cameraFrame/:id/:type/:camera
// @desc     Get Camera Image
// @access   Public
// 23
router.get("/cameraFrame/:id/:type/:camera", getCameraImage);

// @route   GET api/branch/cameraName/:id
// @desc     Get Camera
// @access   Public
// 24
router.get("/cameraName/:id", getCamera);

// @route   POST api/branch/device/:id
// @desc     add device
// @access   Public
// 25
router.post("/device/:id", addDevice);

// @route   GET api/branch/device/:id
// @desc     get device
// @access   Public
// 26
router.get("/device:/id", getDevice);

// @route   POST api/branch/allcamera/:id/:type
// @desc     post allcamera
// @access   Public
// 27
router.post("/allcamera/:id/:type", getAllCamera);

// @route   GET api/branch/getcamera/:id
// @desc     get camera without frame
// @access   Public
// 28
router.get("/getcamera/:id/", getBranchCamera);

// @route    PUT api/branch/mac-address
// @desc     update branch mac address
// @access   Private
// 29
router.put(
  "/mac-address",
  auth,
  branchMacAddressValidator,
  changeBranchMacAddress
);

// @route    GET api/branch/branchzones/:id
// @desc     get branchzones
// @access   Public
// 30
router.get("/branchzones/:id/", getBranchZones);

// @route    GET api/branch/cameraimages/:branchid
// @desc     get camera images via branchId
// @access   Public
// 31
router.get("/cameraimages/:id/", getCameraImagesViaBranchId);

// @route    GET api/branch/cameraimages/:branchid
// @desc     get camera images via branchId
// @access   Public
// 32
router.get("/alertConfig/:branchid", getBranchAlertConfig);

// @route    GET api/branch/alertConfig/:branchId
// @desc     update alertConfig via branchId
// @access   Public
// 33
router.put("/alertConfig/:branchId", updateBranchAlertConfig);

module.exports = router;
