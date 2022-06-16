const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const saltRounds = 10;

exports.getAllClient = async (req, res) => {
  try {
    const users = await Client.find({}).sort("-createdAt");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getSpecificClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      clientId: req.params.id,
    }).populate("user", ["name"]);
    if (!client) {
      return res
        .status(404)
        .send("The client with the provided ID does not exist.");
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.registerClient = async (req, res) => {
  const {
    clientId,
    name,
    email,
    password,
    userType,
    contact,
    location,
    // isActive,
    subscribed,
    dates,
    amount,
    branches,
    // country,
    description,
  } = req.body;
  try {
    if (userType != "client") {
      return res
        .status(409)
        .json({ errors: [{ msg: "something went wrong!" }] });
    } else {
      let user = await Client.findOne({ clientId });
      if (user) {
        return res
          .status(409)
          .json({ errors: [{ msg: "Client already exist" }] });
      }
      user = new Client({
        clientId,
        name,
        email,
        password,
        userType,
        contact,
        location,
        isActive: true,
        subscribed,
        dates,
        amount,
        branches,
        // country,
        description,
      });
      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
          userType: "client",
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
          res.status(200).json({ token });
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ clientId: req.params.id });
    if (!client)
      return res
        .status(404)
        .send("The Client with the provided ID does not exist.");
    return res.status(200).send(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getallClient = async (req, res) => {
  try {
    let myid = mongoose.Types.ObjectId(req.user.id);
    const data = await Client.find({ adminId: myid });
    if (!data) {
      return res.status(404).json({ msg: "There is no data for this user" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.changeClientPassword = async (req, res) => {
  try {
    let user = await Client.findOne({ clientId: req.params.id });
    if (!user)
      return res.status(400).send({
        errors: [{ msg: "No user found with these credentials" }],
      });
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (result === true) {
        bcrypt.hash(req.body.newpassword, saltRounds, async function (
          err,
          hash
        ) {
          var newvalues = { $set: { password: hash } };
          let updatedUser = await user.updateOne(newvalues, function (
            err,
            res
          ) {
            if (err) throw err;
          });
          res.json({ user });
        });
      } else {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
