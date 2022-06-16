const mongoose = require("mongoose");
const PathTrackingSchema = new mongoose.Schema({
  ClientID: {
    type: String,
    required: true,
  },
  BranchID: {
    type: String,
    required: true,
  },
  Timestamp: {
    type: Date,
  },
  CameraID: {
    type: String,
  },
  zone: {
    type: String,
  },
  PersonTimestamps: {
    type: [Date],
  },
});
module.exports = Path_Tracking = mongoose.model(
  "path_tracking",
  PathTrackingSchema
);
