const mongoose = require("mongoose");
const SocialDistancingSchema = new mongoose.Schema({
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
  Image: {
    type: String,
  },
  PersonID: {
    type: String,
  },
  Contacted_PersonID: {
    type: String,
  },
  Zone: {
    type: String,
  },
  current_violation_index: {
    type: Number,
  },
  today_violation_index: {
    type: Number,
  },
});
module.exports = Social_distance = mongoose.model(
  "social_distance",
  SocialDistancingSchema
);
