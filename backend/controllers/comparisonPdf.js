const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const PathTracking = require("../models/PathTracking");
const DwellTimeAnalysis = require("../models/DwellTimeAnalysis");
const auth = require("../middleware/auth");
const moment = require("moment");

function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

exports.WeekVsWeekend = async (req, res) => {
  try {
    const { camera, date } = req.body;
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
    let startweekDay = new Date(start.setDate(start.getDate() + 1));
    let endweekDay = new Date(start.setDate(start.getDate() + 5));
    let endweekendDay = new Date(start.setDate(start.getDate() + 2));
    let weekDays = await PathTracking.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $lt: endweekDay,
            $gt: startweekDay,
          },
        },
      },
      { $unwind: "$PersonTimestamps" },
      { $project: { h: { $hour: "$PersonTimestamps" }, zone: 1 } },
      {
        $group: {
          _id: {
            hour: "$h",
            // zone: "$zone",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          hour: "$_id.hour",
          // zone: "$_id.zone",
          _id: 0,
          count: 1,
        },
      },
      { $sort: { hour: 1 } },
    ]);
    let filledWeekArray = new Array(24).fill([]);
    for (let i = 0; i < filledWeekArray.length; i++) {
      for (let j = 0; j < weekDays.length; j++) {
        if (i == weekDays[j].hour) {
          filledWeekArray[i] = [i, weekDays[j].count];
        }
        if (!filledWeekArray[i].length) filledWeekArray[i] = [i, 0];
      }
    }
    let weekends = await PathTracking.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: branchId,
          CameraID: {
            $in: camera,
          },
          Timestamp: {
            $lt: endweekendDay,
            $gt: endweekDay,
          },
        },
      },
      { $unwind: "$PersonTimestamps" },
      { $project: { h: { $hour: "$PersonTimestamps" }, zone: 1 } },
      {
        $group: {
          _id: {
            hour: "$h",
            // zone: "$zone",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          hour: "$_id.hour",
          // zone: "$_id.zone",
          _id: 0,
          count: 1,
        },
      },
    ]);
    let filledWeekendArray = new Array(24).fill(0);
    for (let i = 0; i < filledWeekendArray.length; i++) {
      for (let j = 0; j < weekends.length; j++) {
        if (i == weekends[j].hour) {
          filledWeekendArray[i] = [JSON.stringify(i), weekends[j].count];
        }
        if (!filledWeekendArray[i].length) filledWeekendArray[i] = [i, 0];
      }
    }
    filledWeekArray.unshift(["Week Hour Based", "Total Visitors"]);
    filledWeekendArray.unshift(["Weekly Hour Based", "Total Visitors"]);
    res.status(200).json([filledWeekArray, filledWeekendArray]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getFootfallZones = async (req, res) => {
  try {
    const { camera } = req.body;
    let distinctZones = [];
    distinctZones = await PathTracking.find({
      BranchID: req.params.branchId,
      // CameraID: { $in: camera },
    }).distinct("zone");
    res.status(200).json(distinctZones);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.CompareZones = async (req, res) => {
  try {
    const { clientId, firstbranch, secondbranch } = req.params;
    const { firstZone, secondZone } = req.query;
    let _date = new Date(req.query.month);
    let format = req.query.month.split("T")[0];
    let year = format.split("-")[0];
    let month = _date.getMonth() + 1;
    let newMonth = month + 1;
    if (newMonth == 13) newMonth = 1;
    month = ("0" + month).slice(-2); // '04'
    newMonth = ("0" + newMonth).slice(-2);
    var firstDayMonth = year + "-" + month + "-" + "01T00:00:00.000Z";
    var lastDayMonth = year + "-" + newMonth + "-" + "01T00:00:00.000Z";
    let firstResult = await PathTracking.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: firstbranch,
          // CameraID: {
          //   $in: camera,
          // },
          zone: firstZone,
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
        },
      },
    ]);
    let secondResult = await PathTracking.aggregate([
      {
        $match: {
          ClientID: clientId,
          BranchID: secondbranch,
          // CameraID: {
          //   $in: camera,
          // },
          zone: secondZone,
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
        },
      },
    ]);
    let firstFilledArray = new Array(31).fill(0);
    let tempArr = [];
    for (let i = 1; i < firstResult.length; i++) {
      let formattedDate = moment(firstResult[i].Timestamp).format("llll");
      let arr = formattedDate.split(" ");
      tempArr = JSON.parse(arr[2].replace(",", ""));
      firstFilledArray[tempArr] = firstResult[i].count;
    }
    // second
    let secondFilledArray = new Array(31).fill(0);
    let secTempArr = [];
    for (let i = 1; i < secondResult.length; i++) {
      let formattedDate = moment(secondResult[i].Timestamp).format("llll");
      let arr = formattedDate.split(" ");
      secTempArr = JSON.parse(arr[2].replace(",", ""));
      secondFilledArray[secTempArr] = secondResult[i].count;
    }
    let firstObj = {
      name: `${firstZone}`,
      type: "column",
      data: firstFilledArray,
    };
    let secondObj = {
      name: `${secondZone}`,
      type: "line",
      data: secondFilledArray,
    };
    let series = [];
    series.push(firstObj, secondObj);
    res.status(200).json(series);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
