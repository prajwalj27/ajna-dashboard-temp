const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const Heatmap = require("../models/Heatmap");
const auth = require("../middleware/auth");

exports.insertHeatmapData = async (req, res) => {
  const { ClientID, BranchID, CameraID, Coordinates, Timestamp } = req.body;
  try {
    let data = {
      ClientID,
      BranchID,
      CameraID,
      Coordinates,
      Timestamp,
    };
    try {
      let client = new Heatmap(data);
      await client.save();
      return res.json({ client });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.DateBasedData = async (req, res) => {
  try {
    let { date, start, end, camera } = req.body;
    let { id, type } = req.params;
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    if (start && end && start.length && end.length) {
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
    client = await Heatmap.findOne({
      BranchID: id,
      Timestamp: { $gte: date, $lte: nextday },
      CameraID: camera,
    }).select("Coordinates");
    if (client == null) client = [];

    if (typeof start == "object" && typeof end == "object") {
      client.Coordinates = client.Coordinates.filter((item) => {
        let date = item.Timestamp;
        return date >= start && date <= end;
      });
    }
    return res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
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
    if (type == "client" || type == "admin") {
      client = await Heatmap.aggregate([
        {
          $match: {
            BranchID: req.params.id,
            Timestamp: { $gte: firstDate, $lte: lastDate },
            CameraID: camera,
          },
        },
        {
          $project: {
            Impressions: { $size: "$Coordinates" },
            ClientID: 1,
            Timestamp: 1,
            CameraID: 1,
            Coordinates: 1,
          },
        },
        { $sort: { Timestamp: 1 } },
      ]);
    } else {
      client = await Heatmap.aggregate([
        {
          $match: {
            ClientID: req.params.id,
            Timestamp: { $gte: firstDate, $lte: lastDate },
            CameraID: camera,
          },
        },
        {
          $project: {
            Impressions: { $size: "$Coordinates" },
            Coordinates: 1,
            ClientID: 1,
            Timestamp: 1,
            CameraID: 1,
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
