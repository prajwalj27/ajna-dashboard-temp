const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  EmployeeId: {
    type: String,
    required: true,
    unique: true,
  },
  modules: {
    type: [String],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
  },
  camera: {
    type: [Object],
  },
  notifications: {
    type: [String],
  },
  alertConfig: {
    type: Object,
  },
  description: {
    type: String,
  },
  editAccess: {
    type: [Object],
  },
  branches: {
    type: [String],
  },
});
module.exports = User = mongoose.model("user", UserSchema);
