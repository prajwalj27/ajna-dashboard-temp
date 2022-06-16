const mongoose = require("mongoose");
const MaskDetectionSchema = new mongoose.Schema({
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
  FaceImage: {
    type: String,
  },
  Face_detected: {
    type: Boolean,
  },
  Mask_detected: {
    type: Boolean,
  },
});
module.exports = Mask_detection = mongoose.model(
  "mask_detection",
  MaskDetectionSchema
);
