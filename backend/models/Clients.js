const mongoose = require("mongoose");
const ClientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    unique: true,
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
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
  },
  subscribed: {
    type: String,
    required: true,
  },
  dates: {
    type: [Date],
    required: true,
  },
  isActive: {
    type: Boolean,
  },
  amount: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
  },
  description: {
    type: String,
  },
  branches: {
    type: [Object],
  },
  users: {
    type: [Object],
  },
});
module.exports = Client = mongoose.model("Client", ClientSchema);
