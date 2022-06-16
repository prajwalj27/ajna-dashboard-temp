const express = require("express");
const router = express.Router();
const PathTracking = require("../models/PathTracking");
const DwellTimeAnalysis = require("../models/DwellTimeAnalysis");
const HeatMapAnalysis = require("../models/Heatmap");
const auth = require("../middleware/auth");
const moment = require("moment");

exports.Weekly = async (req, res) => {
  try {
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));

    let zoneData = [];
    let tempDate = new Date();
    let today = new Date();
    let startWeek = moment().startOf("isoDayOfWeek").toDate();
    let endWeek = moment().endOf("isoweek").toDate();
    const chart = await PathTracking.aggregate([
      {
        $match: {
          client_id: id,
          startTime: {
            $gte: moment().startOf("isoweek").toDate(),
            $lt: moment().endOf("isoweek").toDate(),
          },
          // gate_id: gates,
        },
      },
      { $sort: { startTime: 1, _id: 1 } },
      {
        $project: {
          gate_id: 1,
          startTime: 1,
          visitors: { $size: "$visitors" },
        },
      },
    ]);

    return res.status(200).send(chart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getData = async (req, res) => {
  try {
    let result = await PathTracking.aggregate([
      {
        $match: {
          ClientID: req.params.id,
        },
      },
      { $unwind: "$PersonTimestamps" },
      { $project: { h: { $hour: "$PersonTimestamps" }, zone: 1 } },
      {
        $group: {
          _id: {
            hour: "$h",
            zone: "$zone",
          },
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getPathTrackingHourBased = async (req, res) => {
  try {
    const { camera, date } = req.query;
    const { clientId, branchId } = req.params;
    let result = await PathTracking.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $gte: new Date(`${date}T00:00:00.000Z`),
            $lt: new Date(`${date}T23:59:59.999Z`),
          },
        },
      },
      { $unwind: "$PersonTimestamps" },
      {
        $project: {
          h: { $hour: "$PersonTimestamps" },
          zone: 1,
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $group: {
          _id: {
            hour: "$h",
            zone: "$zone",
          },
          count: { $sum: 1 },
          Camera: { $first: "$CameraID" },
          Branch: { $first: "$BranchID" },
        },
      },
      {
        $project: {
          hour: "$_id.hour",
          zone: "$_id.zone",
          _id: 0,
          count: 1,
          Camera: 1,
          Branch: 1,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "Branch",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },

      {
        $project: {
          count: 1,
          Branch: 1,
          Camera: 1,
          hour: 1,
          zone: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$Camera"],
              },
            },
          },
        },
      },
      {
        $project: {
          count: 1,
          Branch: 1,
          Camera: 1,
          hour: 1,
          zone: 1,
          branch: 1,
          camera: "$camera.cameraName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

exports.getPathTrackingWeekBased = async (req, res) => {
  try {
    const { camera, date } = req.query;
    const { clientId, branchId } = req.params;
    let temp = date;
    let yr = temp.split("-")[0];
    let week = temp.split("-")[1];
    week = week.substring(0, week.length - 2);
    let start = getDateOfISOWeek(week - 1, yr);
    start = start.toISOString();
    start = start.split("T")[0];
    start += "T00:00:00.000Z";
    start = new Date(start);
    let startDay = new Date(start.setDate(start.getDate()));
    let endDay = new Date(start.setDate(start.getDate() + 7));
    let result = await PathTracking.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $lt: endDay,
            $gt: startDay,
          },
        },
      },
      {
        $project: {
          count: { $size: "$PersonTimestamps" },
          Timestamp: 1,
          zone: 1,
          Day: { $dayOfWeek: "$Timestamp" },
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "BranchID",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },
      {
        $project: {
          Day: 1,
          zone: 1,
          _id: 0,
          Timestamp: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$CameraID"],
              },
            },
          },
        },
      },
      {
        $project: {
          Day: 1,
          zone: 1,
          _id: 0,
          Timestamp: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: "$camera.cameraName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getPathTrackingMonthBased = async (req, res) => {
  try {
    const { camera, date } = req.query;
    let _date = new Date(date);
    const { clientId, branchId } = req.params;
    let format = date.split("T")[0];
    let year = format.split("-")[0];
    let month = _date.getMonth() + 1;
    let newMonth = month + 1;
    if (newMonth == 13) newMonth = 1;
    month = ("0" + month).slice(-2); // '04'
    newMonth = ("0" + newMonth).slice(-2);
    var firstDayMonth = year + "-" + month + "-" + "01T00:00:00.000Z";
    var lastDayMonth = year + "-" + newMonth + "-" + "01T00:00:00.000Z";
    let result = await PathTracking.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $lt: new Date(lastDayMonth),
            $gt: new Date(firstDayMonth),
          },
        },
      },
      {
        $project: {
          count: { $size: "$PersonTimestamps" },
          Timestamp: 1,
          zone: 1,
          CameraID: 1,
          BranchID: 1,
          // Day: { $dayOfWeek: ISODate("$Timestamp") },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "BranchID",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },
      {
        $project: {
          Day: 1,
          zone: 1,
          _id: 0,
          Timestamp: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$CameraID"],
              },
            },
          },
        },
      },
      {
        $project: {
          Day: 1,
          zone: 1,
          _id: 0,
          Timestamp: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: "$camera.cameraName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getDwellTimeHourBased = async (req, res) => {
  try {
    const { camera, date } = req.query;
    const { clientId, branchId } = req.params;
    let distinctZones = [];
    distinctZones = await DwellTimeAnalysis.find({
      BranchID: req.params.id,
      CameraID: { $in: camera },
    }).distinct("Zone");
    let result = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $gte: new Date(`${date}T00:00:00.000Z`),
            $lt: new Date(`${date}T23:59:59.999Z`),
          },
        },
      },
      { $unwind: "$passerBy" },
      {
        $project: {
          time: "$passerBy.Timestamp",
          PersonID: "$passerBy.PersonID",
          TimeSpent: "$passerBy.TimeSpent",
          Zone: 1,
          Timestamp: 1,
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $project: {
          h: { $hour: "$time" },
          Zone: 1,
          PersonID: 1,
          TimeSpent: 1,
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $group: {
          _id: {
            hour: "$h",
            zone: "$Zone",
          },
          PersonID: { $first: "$PersonID" },
          TimeSpent: { $avg: "$TimeSpent" },
          count: { $sum: 1 },
          BranchID: { $first: "$BranchID" },
          CameraID: { $first: "$CameraID" },
        },
      },
      {
        $project: {
          hour: "$_id.hour",
          zone: "$_id.zone",
          _id: 0,
          PersonID: 1,
          TimeSpent: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "BranchID",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },
      {
        $project: {
          hour: 1,
          zone: 1,
          _id: 0,
          PersonID: 1,
          TimeSpent: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$CameraID"],
              },
            },
          },
        },
      },
      {
        $project: {
          hour: 1,
          zone: 1,
          _id: 0,
          PersonID: 1,
          TimeSpent: 1,
          count: 1,
          branch: 1,
          CameraID: 1,
          camera: "$camera.cameraName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getDwellTimeWeekBased = async (req, res) => {
  try {
    const { camera, date } = req.query;
    const { clientId, branchId } = req.params;
    let temp = date;
    let yr = temp.split("-")[0];
    let week = temp.split("-")[1];
    week = week.substring(0, week.length - 2);
    let start = getDateOfISOWeek(week - 1, yr);
    start = start.toISOString();
    start = start.split("T")[0];
    start += "T00:00:00.000Z";
    start = new Date(start);
    let startDay = new Date(start.setDate(start.getDate()));
    let endDay = new Date(start.setDate(start.getDate() + 7));
    distinctZones = await DwellTimeAnalysis.find({
      BranchID: req.params.id,
      CameraID: { $in: camera },
    }).distinct("Zone");
    let result = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $lt: endDay,
            $gt: startDay,
          },
        },
      },
      {
        $project: {
          TimeSpent: { $avg: "$passerBy.TimeSpent" },
          count: { $size: "$passerBy.TimeSpent" },
          Timestamp: 1,
          Zone: 1,
          Day: { $dayOfWeek: "$Timestamp" },
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $group: {
          _id: {
            Day: "$Day",
            zone: "$Zone",
          },
          TimeSpent: { $first: "$TimeSpent" },
          Timestamp: { $first: "$Timestamp" },
          count: { $first: "$count" },
          BranchID: { $first: "$BranchID" },
          CameraID: { $first: "$CameraID" },
        },
      },
      {
        $project: {
          Day: "$_id.Day",
          zone: "$_id.zone",
          _id: 0,
          TimeSpent: 1,
          count: 1,
          Timestamp: 1,
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "BranchID",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },
      {
        $project: {
          Day: 1,
          zone: 1,
          _id: 0,
          Timestamp: 1,
          TimeSpent: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$CameraID"],
              },
            },
          },
        },
      },
      {
        $project: {
          Day: 1,
          zone: 1,
          _id: 0,
          TimeSpent: 1,
          Timestamp: 1,
          count: 1,
          branch: 1,
          CameraID: 1,
          camera: "$camera.cameraName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getDwellTimeMonthBased = async (req, res) => {
  try {
    const { camera, date } = req.query;
    let _date = new Date(date);
    const { clientId, branchId } = req.params;
    let format = date.split("T")[0];
    let year = format.split("-")[0];
    let month = _date.getMonth() + 1;
    let newMonth = month + 1;
    if (newMonth == 13) newMonth = 1;
    month = ("0" + month).slice(-2); // '04'
    newMonth = ("0" + newMonth).slice(-2);
    var firstDayMonth = year + "-" + month + "-" + "01T00:00:00.000Z";
    var lastDayMonth = year + "-" + newMonth + "-" + "01T00:00:00.000Z";
    let result = await DwellTimeAnalysis.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $lt: new Date(lastDayMonth),
            $gt: new Date(firstDayMonth),
          },
        },
      },
      {
        $project: {
          TimeSpent: { $avg: "$passerBy.TimeSpent" },
          count: { $size: "$passerBy.TimeSpent" },
          Timestamp: 1,
          BranchID: 1,
          CameraID: 1,
          Zone: 1,
        },
      },
      {
        $group: {
          _id: {
            zone: "$Zone",
          },
          TimeSpent: { $first: "$TimeSpent" },
          Timestamp: { $first: "$Timestamp" },
          count: { $first: "$count" },
          BranchID: { $first: "$BranchID" },
          CameraID: { $first: "$CameraID" },
        },
      },
      {
        $project: {
          zone: "$_id.zone",
          _id: 0,
          TimeSpent: 1,
          count: 1,
          Timestamp: 1,
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "BranchID",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },
      {
        $project: {
          zone: 1,
          _id: 0,
          Timestamp: 1,
          TimeSpent: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$CameraID"],
              },
            },
          },
        },
      },
      {
        $project: {
          zone: 1,
          _id: 0,
          TimeSpent: 1,
          Timestamp: 1,
          count: 1,
          branch: 1,
          CameraID: 1,
          camera: "$camera.cameraName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.heatmapPdf = async (req, res) => {
  try {
    const { camera, date, option } = req.body;
    let firstdate = "",
      nextDay = "";
    if (option == "day") {
      let _date = new Date(date);
      _date = JSON.stringify(_date);
      _date = _date.split("T")[0];
      firstdate = new Date(`${date}T00:00:00.000Z`);
      nextDay = new Date(`${date}T23:59:59.999Z`);
    } else if (option == "week") {
      let temp = date;
      let yr = temp.split("-")[0];
      let week = temp.split("-")[1];
      week = week.substring(0, week.length - 2);
      let start = getDateOfISOWeek(week - 1, yr);
      start = start.toISOString();
      start = start.split("T")[0];
      start += "T00:00:00.000Z";
      start = new Date(start);
      firstdate = new Date(start.setDate(start.getDate()));
      nextDay = new Date(start.setDate(start.getDate() + 7));
    } else if (option == "month") {
      let _date = new Date(date);
      let format = date.split("T")[0];
      let year = format.split("-")[0];
      let month = _date.getMonth() + 1;
      let newMonth = month + 1;
      if (newMonth == 13) newMonth = 1;
      month = ("0" + month).slice(-2); // '04'
      newMonth = ("0" + newMonth).slice(-2);
      firstdate = new Date(year + "-" + month + "-" + "01T00:00:00.000Z");
      nextDay = new Date(year + "-" + newMonth + "-" + "01T00:00:00.000Z");
    }
    let result = await HeatMapAnalysis.aggregate([
      {
        $match: {
          BranchID: req.params.branchId,
          Timestamp: { $gte: firstdate, $lte: nextDay },
          CameraID: { $in: camera },
        },
      },
      {
        $project: {
          Impressions: { $size: "$Coordinates" },
          ClientID: 1,
          Timestamp: 1,
          CameraID: 1,
          Coordinates: 1,
          BranchID: 1,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "BranchID",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },
      {
        $project: {
          _id: 0,
          Timestamp: 1,
          Coordinates: 1,
          Impressions: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$CameraID"],
              },
            },
          },
        },
      },
      {
        $project: {
          Coordinates: 1,
          _id: 0,
          Impressions: 1,
          Timestamp: 1,
          count: 1,
          branch: 1,
          CameraID: 1,
          camera: "$camera.cameraName",
        },
      },
      { $sort: { Timestamp: 1 } },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.pathTrackPdf = async (req, res) => {
  try {
    const { camera, date, option } = req.body;
    let firstdate = "",
      nextDay = "";
    if (option == "day") {
      let _date = new Date(date);
      _date = JSON.stringify(_date);
      _date = _date.split("T")[0];
      firstdate = new Date(`${date}T00:00:00.000Z`);
      nextDay = new Date(`${date}T23:59:59.999Z`);
    } else if (option == "week") {
      let temp = date;
      let yr = temp.split("-")[0];
      let week = temp.split("-")[1];
      week = week.substring(0, week.length - 2);
      let start = getDateOfISOWeek(week - 1, yr);
      start = start.toISOString();
      start = start.split("T")[0];
      start += "T00:00:00.000Z";
      start = new Date(start);
      firstdate = new Date(start.setDate(start.getDate()));
      nextDay = new Date(start.setDate(start.getDate() + 7));
    } else if (option == "month") {
      let _date = new Date(date);
      let format = date.split("T")[0];
      let year = format.split("-")[0];
      let month = _date.getMonth() + 1;
      let newMonth = month + 1;
      if (newMonth == 13) newMonth = 1;
      month = ("0" + month).slice(-2); // '04'
      newMonth = ("0" + newMonth).slice(-2);
      firstdate = new Date(year + "-" + month + "-" + "01T00:00:00.000Z");
      nextDay = new Date(year + "-" + newMonth + "-" + "01T00:00:00.000Z");
    }
    Date(`${date}T23:59:59.999Z`);
    // console.log()
    let result = await PathTracking.aggregate([
      {
        $match: {
          BranchID: req.params.branchId,
          Timestamp: { $gte: firstdate, $lte: nextDay },
          CameraID: { $in: camera },
        },
      },
      {
        $project: {
          PersonTimestamps: {
            $size: "$PersonTimestamps",
          },
          ClientID: 1,
          Timestamp: 1,
          zone: 1,
          CameraID: 1,
          BranchID: 1,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "BranchID",
          foreignField: "branchId",
          as: "branch",
        },
      },
      {
        $addFields: {
          camera: { $first: "$branch.camera" },
          branch: { $first: "$branch.branchName" },
        },
      },
      {
        $project: {
          _id: 0,
          Timestamp: 1,
          PersonTimestamps: 1,
          zone: 1,
          count: 1,
          BranchID: 1,
          CameraID: 1,
          branch: 1,
          camera: {
            $filter: {
              input: "$camera",
              as: "camera",
              cond: {
                $eq: ["$$camera.cameraId", "$CameraID"],
              },
            },
          },
        },
      },
      {
        $project: {
          PersonTimestamps: 1,
          _id: 0,
          Impressions: 1,
          Timestamp: 1,
          zone: 1,
          branch: 1,
          CameraID: 1,
          camera: "$camera.cameraName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.pdfMailSend = async (req, res) => {
  try {
    mail.send(req.body.data, (res) => {
      response.status(200).json({ status: res ? "ok" : "error" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
