const mongoose = require("mongoose");
const SafetyReportingSchema = new mongoose.Schema({
  ClientID: {
    type: String,
    required: true,
  },
  BranchID: {
    type: String,
    required: true,
  },
  Number_of_social_distancing_violations: {
    type: String,
  },
  Number_of_users_not_wearing_masks: {
    type: String,
  },
  Social_distancing_index: {
    type: String,
  },
  Rate_of_contact_spread: {
    type: String,
  },
});
module.exports = safety_reporting = mongoose.model(
  "safety_reporting",
  SafetyReportingSchema
);
