const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Branch = require("../models/Branch");
const PathTracking = require("../models/PathTracking");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const saltRounds = 10;

exports.getAllAdmin = async (req, res) => {
  try {
    const admin = await Admin.find().sort("-createdAt");
    res.status(200).json(admin);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
};

exports.addAdmin = async (req, res) => {
  const { name, email, password, userType } = req.body;
  try {
    if (userType != "admin") {
      return res
        .status(400)
        .json({ errors: [{ msg: "something went wrong !!" }] });
    } else {
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "admin already exist" }] });
      }
      admin = new Admin({
        name,
        email,
        password,
        userType,
      });
      // encrypt password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
      await admin.save();
      const payload = {
        admin: {
          id: admin.id,
          userType: "admin",
        },
      };
      // return jsonwebtoken
      jwt.sign(
        payload,
        jwtSecret,
        // config.get('jwtSecret'),/
        { expiresIn: "24h" },
        async (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await Admin.findOneAndDelete({ email });
    if (!admin)
      return res
        .status(404)
        .send("Admin with the provided Mail does not exist.");
    return res.status(204).send(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
