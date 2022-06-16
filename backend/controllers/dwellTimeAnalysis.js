const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const DwellTimeAnalysis = require("../models/DwellTimeAnalysis");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const saltRounds = 10;

exports.insertDwellTimeData = async (req, res) => {
  const { ClientID, CameraID, passerBy, Timestamp, Zone, BranchID } = req.body;
  try {
    // see if client exists
    let client = await DwellTimeAnalysis.findOne({ ClientID, BranchID });
    let data = {
      ClientID,
      CameraID,
      BranchID,
      passerBy,
      Timestamp,
      Zone,
    };
    client = new DwellTimeAnalysis(data);
    await client.save();
    return res.json({ client });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.updatePersonThreshold = async (req, res) => {
  try {
    let client = await DwellTimeAnalysis.findOneAndUpdate(
      {
        _id: req.params.id,
        "passerBy.PersonID": req.params.personId,
      },
      {
        "passerBy.$.Threshold": true,
      },
      {
        new: true,
      }
    );
    await client.save();
    return res.status(200).json({ client });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteDwellTimeObject = async (req, res) => {
  try {
    const user = await DwellTimeAnalysis.findByIdAndDelete(req.params.id);
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

exports.getDwellTimeData = async (req, res) => {
  try {
    let dates = JSON.parse(req.body.dates);
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));
    const { camera } = req.body;
    const { id } = req.params;
    let client = [];
    if (dates.length) {
      client = await DwellTimeAnalysis.aggregate([
        {
          $match: {
            BranchID: id,
            Timestamp: { $gte: new Date(dates[0]), $lte: new Date(dates[1]) },
            CameraID: { $in: camera },
          },
        },
        { $unwind: "$passerBy" },
        {
          $match: {
            "passerBy.IsPersonExit": true,
          },
        },
        // { $limit: 50 },
      ]).allowDiskUse(true);
    } else {
      client = await DwellTimeAnalysis.aggregate([
        {
          $match: {
            BranchID: id,
            CameraID: { $in: camera },
            Timestamp: { $gte: startOfToday },
          },
        },
        { $unwind: "$passerBy" },
        {
          $match: {
            "passerBy.IsPersonExit": true,
          },
        },
        { $sort: { "passerBy.Timestamp": -1 } },
        { $limit: 45 },
      ])
        // The allowDiskUse option currently requires a dedicated cluster (M10+)
        .allowDiskUse(true);
    }
    res.status(200).json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getWeeklyData = async (req, res) => {
  let { id, type } = req.params;
  const { camera } = req.query;
  let weeklyCordinates = [];
  let today = new Date();
  let tempDate = new Date();
  let currentWeekNumber = today.getWeek();
  tempDate.setDate(today.getDate() - 6);
  tempDate = tempDate.toISOString();
  tempDate = tempDate.split("T")[0];
  tempDate = new Date(`${tempDate}T00:00:00.000Z`);
  try {
    let distinctZones = [];
    distinctZones = await DwellTimeAnalysis.find({
      BranchID: req.params.id,
      CameraID: { $in: camera },
    }).distinct("Zone");
    let zoneData = [];
    zoneData = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          BranchID: id,
          Timestamp: { $gte: new Date(tempDate) },
          CameraID: { $in: camera },
        },
      },
      {
        $project: {
          total: { $sum: "$passerBy.TimeSpent" },
          Zone: 1,
          Timestamp: 1,
          Day: { $dayOfWeek: "$Timestamp" },
        },
      },
    ]);
    let filledArray = new Array(8).fill([]);
    let tempArr = [];
    for (let i = 0; i < zoneData.length; i++) {
      tempArr = zoneData[i].Day;
      filledArray[tempArr] = [...filledArray[tempArr], zoneData[i]];
    }
    for (let z = 0; z < filledArray.length; z++) {
      let insideIndexFilledArray = filledArray[z];
      for (let i = 0; i < insideIndexFilledArray.length; i++) {
        for (let j = 0; j < distinctZones.length; j++) {
          if (insideIndexFilledArray[i].Zone !== distinctZones[j]) {
          } else {
            var key = insideIndexFilledArray[i].Zone,
              obj = {
                [key]: insideIndexFilledArray[i].total,
              };
            insideIndexFilledArray[i] = obj;
          }
        }
      }
    }
    for (let z = 0; z < filledArray.length; z++) {
      let summArray = new Array(distinctZones.length).fill(0);
      var innerArray = filledArray[z];
      for (let i = 0; i < innerArray.length; i++) {
        let innerObject = Object.keys(innerArray[i]);
        for (let j = 0; j < distinctZones.length; j++) {
          if (innerObject[0] === distinctZones[j]) {
            let val = Object.values(innerArray[i]);
            summArray[j] += val[0];
          }
        }
      }
      let random = "";
      switch (z) {
        case 1:
          random = "Sunday";
          break;
        case 2:
          random = "Monday";
          break;
        case 3:
          random = "Tuesday";
          break;
        case 4:
          random = "Wednesday";
          break;
        case 5:
          random = "Thursday";
          break;
        case 6:
          random = "Friday";
          break;
        case 7:
          random = "Saturday";
          break;
      }
      filledArray[z] = [`${random}`, ...summArray];
    }

    let firstRow = distinctZones;
    firstRow.unshift("Weekly Analysis");
    filledArray[0] = firstRow;
    res.json(filledArray);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getTodayData = async (req, res) => {
  try {
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));
    const { camera } = req.query;
    let result = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          Timestamp: { $gte: startOfToday },
          BranchID: `${req.params.id}`,
          CameraID: {
            $in: camera,
          },
        },
      },
      {
        $project: {
          total: { $avg: "$passerBy.TimeSpent" },
          Zone: 1,
        },
      },
      {
        $group: {
          _id: "$Zone",
          TimeSpent: { $avg: "$total" },
        },
      },
    ]);
    let ans = [];
    result.map((i) => {
      let arr = [i._id, i.TimeSpent];
      ans.push(arr);
    });
    ans.unshift(["zones", "Average Dwell Time"]);
    res.json(ans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.todayPasserBy = async (req, res) => {
  try {
    let { type } = req.params;
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));
    // let dates = JSON.parse(req.body.dates);
    const { camera } = req.query;
    let client = [];
    distinctZones = [];
    distinctZones = await DwellTimeAnalysis.find({
      BranchID: req.params.id,
    }).distinct("Zone");
    if (!distinctZones)
      return res.status(400).json({ msg: "There is no client for this user" });
    let result = [];
    client = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          BranchID: req.params.id,
          Timestamp: { $gte: new Date(startOfToday) },
          CameraID: { $in: camera },
        },
      },
      {
        $project: {
          Zone: 1,
          total: {
            $size: "$passerBy",
          },
        },
      },
    ]);

    for (let i = 0; i < client.length; i++) {
      let tempArr = [client[i].Zone, client[i].total];
      result.push(tempArr);
    }
    result.unshift(["Zone", "No Of Passersby"]);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getMaxMinAvg = async (req, res) => {
  try {
    let { type } = req.params;
    const { camera } = req.query;
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));
    // let branch = await DwellTimeAnalysis.find({ BranchID: req.params.id });
    // if (!branch)
    //   return res.status(404).json({ msg: "There is no client for this user" });
    let maxTimeSpent = 0,
      minTimeSpent = 0,
      avgTimeSpent = 0;
    maxTimeSpent = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          Timestamp: { $gte: startOfToday },
          BranchID: `${req.params.id}`,
          CameraID: {
            $in: camera,
          },
        },
      },
      {
        $project: {
          total: { $max: "$passerBy.TimeSpent" },
          Zone: 1,
        },
      },
      {
        $group: {
          _id: { zone: "$Zone", total: "$total" },
          // TimeSpent: { $max: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          zone: "$_id.zone",
          total: { $round: ["$_id.total", 1] },
        },
      },
    ]);
    minTimeSpent = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          Timestamp: { $gte: startOfToday },
          BranchID: `${req.params.id}`,
          CameraID: {
            $in: camera,
          },
        },
      },
      {
        $project: {
          total: { $min: "$passerBy.TimeSpent" },
          Zone: 1,
        },
      },
      {
        $group: {
          _id: { zone: "$Zone", total: "$total" },
          // TimeSpent: { $min: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          zone: "$_id.zone",
          total: { $round: ["$_id.total", 1] },
        },
      },
    ]);

    avgTimeSpent = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          Timestamp: { $gte: startOfToday },
          BranchID: `${req.params.id}`,
          CameraID: {
            $in: camera,
          },
        },
      },
      {
        $project: {
          total: { $avg: "$passerBy.TimeSpent" },
          Zone: 1,
        },
      },
      {
        $group: {
          _id: { zone: "$Zone", total: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          zone: "$_id.zone",
          total: { $round: ["$_id.total", 1] },
        },
      },
    ]);

    res.status(200).json({ maxTimeSpent, minTimeSpent, avgTimeSpent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getPdfData = async (req, res) => {
  try {
    const client = await DwellTimeAnalysis.find({
      ClientID: req.params.id,
      Timestamp: { $gte: req.body.data[0], $lte: req.body.data[1] },
    });
    if (!client) {
      return res.status(400).json({ msg: "There is no client for this user" });
    }
    res.send(client);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
