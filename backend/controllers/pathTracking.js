const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const PathTracking = require("../models/PathTracking");
const auth = require("../middleware/auth");

exports.insertData = async (req, res) => {
  const {
    ClientID,
    BranchID,
    Timestamp,
    CameraID,
    PersonTimestamps,
    zone,
  } = req.body;
  try {
    let data = {
      ClientID,
      BranchID,
      Timestamp,
      CameraID,
      zone,
      PersonTimestamps,
    };
    let client = new PathTracking(data);
    await client.save();
    return res.json({ client });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.dateBaseData = async (req, res) => {
  try {
    let { date, start, end, camera } = req.body;
    let { id, type } = req.params;
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    if (start && end && start.length && end.length) {
      // date = new Date(date).toISOString();
      date = convertUTCDateToLocalDate(new Date(date)).toISOString();
      start = date.replace(date.split("T")[1].split("Z")[0], start);
      end = date.replace(date.split("T")[1].split("Z")[0], end);
      end = end.replace("000", "999");
      start = new Date(start);
      end = new Date(end);
    }

    date = new Date(date);
    let nextday = new Date(date);
    date.setHours(0, 0, 0, 0);
    date = convertUTCDateToLocalDate(new Date(date));
    nextday.setHours(23, 59, 59, 999);
    nextday = convertUTCDateToLocalDate(new Date(nextday));
    let client = [];

    nextday = nextday.toISOString();
    date = date.toISOString();
    // var client = [];
    if (start && end) {
      client = await PathTracking.aggregate([
        {
          $match: {
            ClientID: req.params.id,
            Timestamp: { $gte: new Date(date), $lte: new Date(nextday) },
            CameraID: camera,
          },
        },
        {
          $project: {
            PersonTimestamps: {
              $size: {
                $filter: {
                  input: "$PersonTimestamps",
                  as: "user",
                  cond: {
                    $and: [
                      { $gte: ["$$user", start] },
                      { $lte: ["$$user", end] },
                    ],
                  },
                },
              },
            },
            ClientID: 1,
            Timestamp: 1,
            zone: 1,
            CameraID: 1,
          },
        },
      ]);
    } else {
      client = await PathTracking.aggregate([
        {
          $match: {
            ClientID: `${req.params.id}`,
            Timestamp: { $gt: new Date(date), $lt: new Date(nextday) },
            CameraID: camera,
          },
        },
        {
          $project: {
            PersonTimestamps: { $size: "$PersonTimestamps" },
            ClientID: 1,
            Timestamp: 1,
            zone: 1,
            CameraID: 1,
          },
        },
      ]);
    }
    if (!client) {
      return res.status(404).json({ msg: "There is no client for this user" });
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updatePathTracking = async (req, res) => {
  const { ClientID, Timestamp, CameraID, Coordinates } = req.body;
  try {
    let client = await PathTracking.findOneAndUpdate(
      { ClientID },
      {
        $push: {
          "Coordinates.0.B": "2020-08-26T19:04:52+00:00",
        },
      }
    );
    if (!client) {
      return res.status(400).json({ msg: "There is no client for this user" });
    }
    await client.save();
    return res.json({ client });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.MonthBasedData = async (req, res) => {
  try {
    let { month, camera } = req.query;
    let { id, type } = req.params;
    let date = new Date(month);
    var last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let startDateOfMonth = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-01T00:00:00.000Z`;
    let lastDateOfMonth = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-${last}T23:59:59.999Z`;

    let firstDate = new Date(startDateOfMonth);
    let lastDate = new Date(lastDateOfMonth);
    let client = [];
    if (type == "user") {
      client = await PathTracking.aggregate([
        {
          $match: {
            ClientID: req.params.id,
            Timestamp: { $gte: firstDate, $lte: lastDate },
            CameraID: camera,
          },
        },
        {
          $project: {
            Impressions: { $size: "$PersonTimestamps" },
            ClientID: 1,
            Timestamp: 1,
            zone: 1,
          },
        },
        { $sort: { Timestamp: 1 } },
      ]);
    } else {
      client = await PathTracking.aggregate([
        {
          $match: {
            BranchID: req.params.id,
            Timestamp: { $gte: firstDate, $lte: lastDate },
            CameraID: camera,
          },
        },
        {
          $project: {
            Impressions: { $size: "$PersonTimestamps" },
            ClientID: 1,
            BranchID: 1,
            Timestamp: 1,
            zone: 1,
          },
        },
        {
          $lookup: {
            from: "branches",
            localField: "BranchID",
            foreignField: "branchId",
            as: "configurations",
          },
        },
        {
          $project: {
            Impressions: 1,
            ClientID: 1,
            BranchID: 1,
            Timestamp: 1,
            zone: 1,
            pathTracking: { $arrayElemAt: ["$configurations", 0] },
          },
        },
        {
          $project: {
            Impressions: 1,
            ClientID: 1,
            BranchID: 1,
            Timestamp: 1,
            zone: 1,
            pathTracking: "$pathTracking.configuration.pathtracking",
          },
        },
        {
          $project: {
            Impressions: 1,
            ClientID: 1,
            BranchID: 1,
            Timestamp: 1,
            zone: 1,
            pathTracking: {
              $filter: {
                input: "$pathTracking",
                as: "pathtrack",
                cond: {
                  $eq: ["$$pathtrack.zone", "$zone"],
                },
              },
            },
          },
        },
        { $sort: { Timestamp: 1 } },
      ]);
    }
    if (client == null) {
      client = [];
      return res.json(client);
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteObj = async (req, res) => {
  try {
    const user = await PathTracking.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ msg: "The Client with the provided ID does not exist." });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
