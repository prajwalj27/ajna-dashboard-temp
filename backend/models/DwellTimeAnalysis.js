const mongoose = require("mongoose");
const DwellTimeSchema = new mongoose.Schema({
  ClientID: String,
  Timestamp: Date,
  CameraID: String,
  BranchID: String,
  passerBy: [
    {
      PersonID: String,
      TimeSpent: Number,
      Timestamp: Date,
      Threshold: Boolean,
      IsPersonExit: Boolean,
    },
  ],
  Zone: String,
});
module.exports = dwellTime_analysis = mongoose.model(
  "dwellTime_analysis",
  DwellTimeSchema
);
