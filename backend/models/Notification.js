const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  ClientID: {
    type: String,
    required: true,
  },
  BranchID: {
    type: String,
    required: true,
  },
  CameraID: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: false,
  },
  read_by: [
    {
      readerId: { type: mongoose.Schema.Types.ObjectId, ref: "client" },
      read_at: { type: Date, default: Date.now },
    },
  ],
  created_at: { type: Date, default: Date.now },
});
module.exports = Notification = mongoose.model(
  "notification",
  NotificationSchema
);
