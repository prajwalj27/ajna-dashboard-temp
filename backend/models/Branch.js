const mongoose = require("mongoose");
const BranchSchema = new mongoose.Schema({
  branchId: {
    type: String,
    required: true,
    unique: true,
  },
  branchName: {
    type: String,
    trim: true,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
  },
  Mac_address: {
    type: [String],
  },
  isDefaultBranch: {
    type: Boolean,
  },
  isAdminAccepted: {
    type: Boolean,
  },
  modules: {
    type: [String],
    required: true,
  },
  NoOfCameras: {
    type: Number,
  },
  camera: {
    type: [
      {
        cameraId: { type: String },
        key: { type: Number },
        cameraName: { type: String },
        deviceId: { type: String },
        cameraStatus: { type: Boolean },
        Link: { type: String },
        deviceName: { type: String },
        cameraFrame: { type: String },
      },
    ],
  },
  device: {
    type: [
      {
        deviceName: { type: String },
        deviceId: { type: String },
        macAddress: { type: String },
        cameras: { type: [String] },
        deviceStatus: { type: Boolean },
      },
    ],
  },
  location: {
    type: String,
  },
  configuration: {
    type: {
      zone: {
        type: [
          { points: [Number], zone: String, camera: String, direction: String },
        ],
      },
      socialDistancing: {
        type: [
          { points: [Number], zone: String, camera: String, direction: String },
        ],
      },
      pathtracking: {
        type: [
          {
            points: [Number],
            zone: String,
            CameraID: String,
            arrowColor: String,
          },
        ],
      },
    },
  },
  dates: {
    type: [Date],
  },
  amount: {
    type: Number,
  },
  subscribed: {
    type: String,
  },
  description: {
    type: String,
  },
  alertConfig: {
    type: {
      retailAnalytics: {
        // isRetailModuleActive: true,
        isFootfallCountActive: true,
        // dwellTimeThreshold: 0,
        // isdwellTimeAnalysisActive: true,
      },
    },
  },
});
module.exports = branch = mongoose.model("branch", BranchSchema);
