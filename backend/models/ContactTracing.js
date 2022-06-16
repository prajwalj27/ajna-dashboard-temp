const mongoose = require("mongoose");
const Contact_TracingSchema = new mongoose.Schema({
  ClientID: {
    type: String,
    required: true,
  },
  BranchID: {
    type: String,
    required: true,
  },
  PersonID: {
    type: String,
  },
  ContactedPersonID: {
    type: String,
  },
  Timestamp: {
    type: Date,
  },
  CameraID: {
    type: String,
  },
  img: {
    type: String,
  },
});
module.exports = Contact_Tracing = mongoose.model(
  "contact_tracing",
  Contact_TracingSchema
);
