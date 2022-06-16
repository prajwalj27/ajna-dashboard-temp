const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const saltRounds = 10;

async function clientNewBranch(id, branch) {
  try {
    let client = await Client.findOneAndUpdate(
      { clientId: id },
      { $addToSet: { branches: branch } },
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

exports.addNewBranch = async (req, res) => {
  try {
    const {
      clientId,
      userType,
      Mac_address,
      branchId,
      isDefaultBranch,
      isAdminAccepted,
      modules,
      email,
      branchName,
      NoOfCameras,
      deviceStatus,
      camera,
      location,
      image,
      configuration,
      dates,
      amount,
      subscribed,
      description,
    } = req.body;

    let branch = await Branch.findOne({ branchId });
    if (branch) {
      return res
        .status(409)
        .json({ errors: [{ msg: "Branch already exist" }] });
    }
    let alertConfig = {
      retailAnalytics: {
        isRetailModuleActive: true,
        isFootfallCountActive: true,
        dwellTimeThreshold: 0,
        isdwellTimeAnalysisActive: true,
      },
    };
    branch = new Branch({
      clientId,
      userType,
      branchId,
      branchName,
      Mac_address,
      isDefaultBranch,
      isAdminAccepted,
      modules,
      NoOfCameras,
      deviceStatus,
      camera,
      location,
      image,
      configuration,
      dates,
      amount,
      // email,
      subscribed,
      description,
      alertConfig,
    });
    // encrypt password
    await branch.save();
    res.status(200).send({ branch });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.AdminAcceptedBranches = async (req, res) => {
  try {
    const branch = await Branch.find({
      isAdminAccepted: true,
    }).select("-camera.cameraFrame");
    res.json(branch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findOneAndDelete({
      branchId: req.params.branchId,
    });
    res.status(200).json(branch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getBranchViaBranchId = async (req, res) => {
  try {
    const branch = await Branch.findOne({
      branchId: req.params.id,
      // isAdminAccepted: true,
    }).select("-camera.cameraFrame");
    if (!branch) {
      return res.status(400).json({ msg: "There is no Branch " });
    }
    res.status(200).json(branch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.specificClientBranchesAcceptedByAdmin = async (req, res) => {
  try {
    const branch = await Branch.find({
      clientId: req.params.id,
      isAdminAccepted: true,
    }).select("-camera.cameraFrame");
    res.status(200).json(branch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.allBranchesNotAcceptedByAdmin = async (req, res) => {
  try {
    const client = await Branch.find({
      isAdminAccepted: false,
    }).select("-camera.cameraFrame");
    res.status(200).json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.branchConfiguration = async (req, res) => {
  try {
    let data = await Branch.findOne({ branchId: req.params.id })
      .select("configuration")
      .select("-_id");
    if (!data)
      return res.status(404).json({ msg: "There is no client for this id" });
    res.send(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.changeBranchStatusByAdmin = async (req, res) => {
  try {
    let { val } = req.body;
    let data = await Branch.findOne({ branchId: req.params.id });
    if (data) {
      data.isAdminAccepted = val;
      const { branchId, branchName, clientId } = data;
      // add this branchid in client table
      let obj = {};
      obj[branchId] = branchName;
      await clientNewBranch(clientId, obj);
      await data.save();
      return res.status(200).json(data);
    }
    return res.status(400).json({ msg: "There is no client for this email" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.changeMacAddress = async (req, res) => {
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { Mac_address, client_email } = req.body;
    let mac = Mac_address;
    let data = await Client.findOne({ email: client_email });
    if (data) {
      if (data.Mac_address.includes(mac)) {
        return res.json(data);
      }
      data.Mac_address.push(mac);
      await data.save();
      return res.json(data);
    }
    return res.status(400).json({ msg: "There is no client for this email" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.UpdateConfigureZone = async (req, res) => {
  try {
    let data = await Branch.findOne({ branchId: req.params.id });
    if (!data)
      return res.status(404).json({ msg: "There is no client for this id" });
    let zones = [];
    if (
      data.configuration &&
      data.configuration.zone &&
      data.configuration.zone.length
    ) {
      zones = data.configuration.zone.filter((i) => {
        return i.zone !== req.body.configuration.zone;
      });
    }
    zones.push(req.body.configuration);
    const result = await Branch.findOneAndUpdate(
      { branchId: req.params.id },
      { "configuration.zone": zones },
      {
        new: true,
      }
    );
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getConfigureZone = async (req, res) => {
  try {
    let data = await Branch.findOne({ branchId: req.params.id })
      .select("configuration.zone")
      .select("-_id");
    if (!data)
      return res.status(404).json({ msg: "There is no client for this id" });
    res.send(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.updateConfigureSocial = async (req, res) => {
  try {
    let data = await Branch.findOne({ branchId: req.params.id });
    if (!data)
      return res.status(400).json({ msg: "There is no client for this id" });
    let zones = [];
    if (
      data.configuration &&
      data.configuration.socialDistancing &&
      data.configuration.socialDistancing.length
    ) {
      zones = data.configuration.socialDistancing.filter((i) => {
        return i.zone !== req.body.configuration.zone;
      });
    }
    zones.push(req.body.configuration);
    const result = await Branch.findOneAndUpdate(
      { branchId: req.params.id },
      { "configuration.socialDistancing": zones },
      {
        new: true,
      }
    );
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getConfigureSocial = async (req, res) => {
  try {
    let data = await Branch.findOne({ branchId: req.params.id })
      .select("configuration.socialDistancing")
      .select("-_id");
    if (!data)
      return res.status(400).json({ msg: "There is no client for this id" });
    res.send(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.updateConfigurepath = async (req, res) => {
  try {
    const { id, type } = req.params;
    const { configuration, camera } = req.body;
    let result = {};
    let data = await Branch.findOne({ branchId: id });
    if (!data)
      return res.status(400).json({ msg: "There is no branch for this id" });
    let zones = [];
    if (
      data.configuration &&
      data.configuration.pathtracking &&
      data.configuration.pathtracking.length
    ) {
      zones = data.configuration.pathtracking.filter((i) => {
        return i.zone !== req.body.configuration.zone;
      });
    }
    zones.push(req.body.configuration);
    result = await Branch.findOneAndUpdate(
      { branchId: req.params.id },
      { "configuration.pathtracking": zones },
      {
        new: true,
      }
    );
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getConfigurepath = async (req, res) => {
  try {
    let { id, c_id, type } = req.params;

    let data = {};
    if (type == "client") {
      data = await Branch.findOne({ branchId: id, "camera.cameraId": c_id })
        .select("configuration.pathtracking")
        .select("-_id");
    } else {
      data = await Branch.findOne({ clientId: id, "camera.cameraId": c_id })
        .select("configuration.pathtracking")
        .select("-_id");
    }
    if (!data) return res.status(400).json({ msg: "Doesn't exist" });

    let result = [];
    {
      data.configuration &&
        data.configuration.pathtracking &&
        data.configuration.pathtracking.map((item) => {
          if (item.CameraID == c_id) {
            result.push(item);
          }
        });
    }
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.updateCameraImage = async (req, res) => {
  try {
    const { image, camera } = req.body;
    const { id, type } = req.params;
    let result = {};
    if (type == "client") {
      result = await Branch.findOneAndUpdate(
        { branchId: id, "camera.cameraId": camera },
        { $set: { "camera.$.cameraFrame": image } },
        { returnOriginal: false }
      );
    } else {
      result = await Branch.findOneAndUpdate(
        { clientId: id, "camera.cameraId": camera },
        { $set: { "camera.$.cameraFrame": image } },
        { returnOriginal: false }
      );
    }
    if (!result)
      return res.status(404).json({ msg: "There is no client for this id" });
    await result.save();
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.addCamera = async (req, res) => {
  try {
    let { camera } = req.body;
    let dataClient = await Branch.findOne({ branchId: req.params.id });
    dataClient.camera = [...dataClient.camera, camera];
    await dataClient.save();
    return res.json({ dataClient });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteCamera = async (req, res) => {
  try {
    let dataClient = await Branch.findOneAndUpdate(
      { branchId: req.params.id },
      { $pull: { camera: { cameraId: req.params.c_id } } },
      {
        new: true,
      }
    );
    return res.send(dataClient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.updateCamera = async (req, res) => {
  try {
    const { camera } = req.body;
    let dataClient = await Branch.findOneAndUpdate(
      { branchId: req.params.id, "camera.cameraId": req.params.c_id },
      {
        $set: {
          "camera.$.cameraName": camera.cameraName,
          "camera.$.deviceId": camera.deviceId,
          "camera.$.Link": camera.Link,
          "camera.$.deviceName": camera.deviceName,
        },
      },
      {
        new: true,
      }
    );
    return res.send(dataClient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
exports.updateDevice = async (req, res) => {
  try {
    const { device } = req.body;
    let dataClient = await Branch.findOneAndUpdate(
      { branchId: req.params.id, "device.deviceId": req.params.device_id },
      {
        $set: {
          "device.$.mac": device.mac,
          "device.$.deviceName": device.deviceName,
        },
      },
      {
        new: true,
      }
    );
    return res.send(dataClient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    let dataClient = await Branch.findOneAndUpdate(
      { branchId: req.params.id },
      { $pull: { device: { deviceId: req.params.device_id } } },
      {
        new: true,
      }
    );
    return res.send(dataClient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getBranchCamera = async (req, res) => {
  try {
    const { id, type } = req.params;
    let branchCamera = {};
    if (type == "client") {
      branchCamera = await Branch.findOne({ branchId: id }).select("camera");
    } else {
      branchCamera = {};
    }
    return res.json(branchCamera);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getCameraImage = async (req, res) => {
  try {
    const { id, type, camera } = req.params;
    let branchCamera = [];
    branchCamera = await Branch.findOne({
      branchId: id,
      camera: { $elemMatch: { cameraId: camera } },
    })
      .select("camera.cameraId")
      .select("camera.cameraFrame");
    let image = "";
    if (branchCamera && branchCamera.camera && branchCamera.camera.length) {
      branchCamera.camera.map((i) => {
        if (i.cameraId == camera) image = i.cameraFrame;
      });
    }
    return res.json(image);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getCamera = async (req, res) => {
  try {
    let dataClient = await Branch.findOne({ clientId: req.params.id }).select(
      "camera"
    );
    return res.json(dataClient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.addDevice = async (req, res) => {
  try {
    let { device } = req.body;
    let dataClient = await Branch.findOne({ branchId: req.params.id });
    if (!dataClient)
      return res.status(404).json({ msg: "There is no branch for this id" });
    let deviceId = await Branch.find({
      branchId: req.params.id,
      device: { $elemMatch: { deviceId: req.body.deviceId } },
    });
    if (deviceId.length) {
      return res.status(400).json({ msg: "Device Id Already Exist" });
    }
    let alreadyAvailable = [...dataClient.device, device];
    dataClient.device = alreadyAvailable;
    await dataClient.save();
    return res.json({ dataClient });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getDevice = async (req, res) => {
  try {
    let branchDevice = await Branch.findOne({ branchId: req.params.id }).select(
      "device"
    );
    return res.status(200).json(branchDevice);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllCamera = async (req, res) => {
  try {
    const { id, type } = req.params;
    let data = [];
    if (type == "client") {
      data = await Branch.findOne({ branchId: id })
        .select("camera")
        .select("-_id");
      if (!data)
        return res.status(400).json({ msg: "There is no client for this id" });
      data = data.camera;
    } else {
      let findCameras = req.body.camera.map((i) => {
        return i.cameraId;
      });
      data = await Branch.aggregate([
        {
          $match: {
            branchId: req.query.branch,
            "camera.cameraId": {
              $in: findCameras,
            },
          },
        },
        {
          $group: {
            _id: {
              Camera: "$camera",
              Branch: "$branchId",
            },
          },
        },
      ]);
      if (!data)
        return res.status(400).json({ msg: "There is no client for this id" });
      let result = [];
      data.map((i) => {
        i._id.Camera.map((j) => {
          if (findCameras.includes(j.cameraId)) result = [...result, j];
        });
      });
      data = result;
    }

    res.send(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getBranchCamera = async (req, res) => {
  try {
    let branchCamera = await Branch.aggregate([
      { $match: { branchId: req.params.id } },
      { $project: { "camera.cameraFrame": 0 } },
      { $unset: ["modules", "branchId", "device", "configuration"] },
    ]);
    return res.json(branchCamera);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.changeBranchMacAddress = async (req, res) => {
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { Mac_address, branchId } = req.body;
    let mac = Mac_address;
    let data = await Branch.findOne({ branchId });
    if (data) {
      if (data.Mac_address.includes(mac)) {
        return res.json(data);
      }
      data.Mac_address.push(mac);
      await data.save();
      return res.json(data);
    }
    return res.status(400).json({ msg: "There is no client for this email" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getBranchZones = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await Branch.findOne({ branchId: id })
      .select("configuration.pathtracking")
      .select("-_id");
    if (!data) return res.status(404).json({ msg: "Doesn't exist" });
    let result = [];
    {
      data &&
        data.configuration &&
        data.configuration.pathtracking &&
        data.configuration.pathtracking.map((item) => {
          result.push(item.zone);
        });
    }
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getCameraImagesViaBranchId = async (req, res) => {
  try {
    let { id } = req.params;
    let data = await Branch.aggregate([
      { $match: { branchId: id } },
      {
        $project: {
          _id: 0,
          camera: 1,
        },
      },
    ]);
    if (!data) return res.status(404).json({ msg: "Doesn't exist" });
    let result = [];
    data.length &&
      data[0].camera &&
      data[0].camera.length &&
      data[0].camera.map((frame) => {
        result.push(frame.cameraFrame);
      });
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getBranchAlertConfig = async (req, res) => {
  try {
    let { branchid } = req.params;
    let data = await Branch.aggregate([
      { $match: { branchId: branchid } },
      {
        $project: {
          _id: 0,
          alertConfig: 1,
        },
      },
    ]);
    if (!data) return res.status(404).json({ msg: "Doesn't exist" });
    res.status(200).send(data[0].alertConfig);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.updateBranchAlertConfig = async (req, res) => {
  try {
    let { data } = req.body;
    let branch = await Branch.findOneAndUpdate(
      { branchId: req.params.branchId },
      {
        "alertConfig.retailAnalytics": data.retailAnalytics,
      },
      {
        new: true,
      }
    );
    if (!branch) {
      return res.status(404).json({ msg: "There is no client for this email" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
