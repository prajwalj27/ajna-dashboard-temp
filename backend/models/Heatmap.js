const mongoose = require("mongoose");
const HeatMapSchema = new mongoose.Schema({
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
  Coordinates: {
    type: [
      { x: { type: Number }, y: { type: Number }, Timestamp: { type: Date } },
    ],
  },
  CameraID: {
    type: String,
  },
});
module.exports = heatmap = mongoose.model("heatmap", HeatMapSchema);
