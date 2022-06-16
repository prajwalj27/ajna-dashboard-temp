const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const User = require("../models/User");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const saltRounds = 10;

async function clientNewUser(id, user) {
  try {
    let client = await Client.findOneAndUpdate(
      { clientId: id },
      { $addToSet: { users: user } },
      {
        new: true,
      }
    );
    return client;
  } catch (error) {
    console.error(error.message);
    return "Server Error";
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).sort("-createdAt");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUsersSpecificClient = async (req, res) => {
  try {
    const users = await User.find({ clientId: req.params.id }).sort(
      "-createdAt"
    );
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUsersSpecificUserId = async (req, res) => {
  try {
    const user = await User.findOne({ EmployeeId: req.params.id });
    res.json(user);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
};
exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    clientId,
    modules,
    camera,
    deviceStatus,
    notification,
    alertConfig,
    EmployeeId,
    editAccess,
    userBranches,
  } = req.body;
  try {
    if (userType != "user") {
      return res
        .status(400)
        .json({ errors: [{ msg: "something went wrong !" }] });
    } else {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already exist" }] });
      }
      let client = await Client.findOne({ clientId });
      if (!client) {
        return res
          .status(404)
          .json({ errors: [{ msg: "client doesn't exist" }] });
      }
      let empId = await User.findOne({ EmployeeId });
      if (empId) {
        return res
          .status(409)
          .json({ errors: [{ msg: "EmployeeId Already exist" }] });
      }
      let alertConfig = {
        crowdSafety: {
          isCrowdModuleActive: true,
          isMaskDetectionActive: true,
          isSocialDistancingActive: true,
          isViolationIndexActive: true,
          ViolationThreshold: 80,
        },
        retailAnalytics: {
          isRetailModuleActive: true,
          isCrowdDensityActive: true,
          // crowdDensityThreshold: 80,
          // dwellTimeThreshold: 1200,
          zones: [],
          // isdwellTimeAnalysisActive: true,
        },
        queueManage: {},
      };
      user = new User({
        EmployeeId,
        name,
        email,
        password,
        userType,
        clientId,
        modules,
        camera,
        editAccess,
        deviceStatus,
        notification,
        alertConfig,
        branches: userBranches,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      let obj = {};
      obj[EmployeeId] = name;
      let checkResponse = await clientNewUser(clientId, obj);
      await user.save();

      const payload = {
        user: {
          id: user.id,
          userType: "user",
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
          return res.json({ token });
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ EmployeeId: req.params.id });
    const client = await Client.findOne({ clientId: req.query.clientId });
    if (!client)
      return res.status(400).json({ msg: "There is no client for this id" });

    let users = client.users;
    let userIndex = 0;
    users.map((i, index) => {
      if (Object.keys(i)[0] == req.params.id) {
        userIndex = index;
      }
    });
    users.splice(userIndex, 1);
    client.users = users;
    await client.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
};

exports.editUser = async (req, res) => {
  try {
    const { name, modules, email, camera, editAccess, EmployeeId } = req.body;
    const result = await User.findOneAndUpdate(
      { EmployeeId },
      {
        $set: {
          name,
          modules,
          camera,
          editAccess,
        },
      },
      { returnOriginal: false }
    );
    if (!result)
      return res.status(400).json({ msg: "There is no client for this id" });
    await result.save();
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    let user = await User.findOne({ clientId: req.params.id });
    // console.log(user)
    if (!user) {
      return res.status(400).send({
        errors: [{ msg: "No user found with these credentials" }],
      });
    } else {
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
              // console.log("upda",user)
            });
            res.json({ user });
          });
        } else {
          // send json response for incorrect username and password
          res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.updateCameraStatus = async (req, res) => {
  try {
    let { cameraStatus } = req.body;
    let key = Object.keys(cameraStatus);
    let val = Object.values(cameraStatus);
    const result = await User.findOneAndUpdate(
      { clientId: req.params.id, "camera.cameraId": key[0] },
      { $set: { "camera.$.cameraStatus": val[0] } },
      { returnOriginal: false }
    );
    const resultClient = await Client.findOneAndUpdate(
      { clientId: req.params.id, "camera.cameraId": key[0] },
      { $set: { "camera.$.cameraStatus": val[0] } },
      { returnOriginal: false }
    );
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getCameraStatus = async (req, res) => {
  try {
    const users = await User.findOne({ clientId: req.params.id });
    if (!users) {
      return res.status(400).send({
        errors: [{ msg: "User Doesn't exist" }],
      });
    }
    res.json(users.camera);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
