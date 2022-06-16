const mongoose = require("mongoose");
const FootfallSchema = new mongoose.Schema({
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
  Current_Person_Count: {
    type: Number,
  },
  Total_Person_Count: {
    type: Number,
  },
  Zone: {
    type: String,
  },
  PercentValue: {
    type: Number,
  },
  Density: {
    type: String,
  },
});
module.exports = footfall_analysis = mongoose.model(
  "footfall_analysis",
  FootfallSchema
);
