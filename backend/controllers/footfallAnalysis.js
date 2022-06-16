const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const FootfallAnalysis = require("../models/FootfallAnalysis");
const auth = require("../middleware/auth");
const moment = require("moment");
exports.insertFootfallData = async (req, res) => {
  try {
    const {
      ClientID,
      BranchID,
      CameraID,
      Current_Person_Count,
      Total_Person_Count,
      Timestamp,
      Zone,
      PercentValue,
      Density,
    } = req.body;
    let client = await FootfallAnalysis.findOne({ ClientID });
    let data = {
      ClientID,
      BranchID,
      CameraID,
      Current_Person_Count,
      Total_Person_Count,
      Timestamp,
      Zone,
      PercentValue,
      Density,
    };
    client = new FootfallAnalysis(data);
    await client.save();

    return res.status(200).json({ client });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateFootfallData = async (req, res) => {
  try {
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));

    let client = await FootfallAnalysis.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        Current_Person_Count: req.body.Current_Person_Count,
        Total_Person_Count: req.body.Total_Person_Count,
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

exports.getWeeklyData = async (req, res) => {
  let weeklyCordinates = [];
  let today = new Date();
  let tempDate = new Date();
  const { camera } = req.query;
  let currentWeekNumber = today.getWeek();
  tempDate.setDate(today.getDate() - 7);

  try {
    let zoneData = await FootfallAnalysis.aggregate([
      {
        $match: {
          BranchID: req.params.id,
          Timestamp: { $gte: new Date(tempDate) },
          CameraID: {
            $in: camera,
          },
        },
      },
      {
        $project: {
          w: { $isoWeek: "$Timestamp" },
          Zone: 1,
          BranchID: 1,
          Timestamp: 1,
          CameraID: 1,
          Total_Person_Count: 1,
        },
      },
      {
        $match: {
          w: currentWeekNumber,
        },
      },
      {
        $project: {
          d: { $dayOfWeek: "$Timestamp" },
          Zone: 1,
          BranchID: 1,
          Timestamp: 1,
          CameraID: 1,
          w: 1,
          Total_Person_Count: 1,
        },
      },
      {
        $group: {
          _id: {
            zone: "$Zone",
            dayOfWeek: "$d",
          },
          BranchID: { $first: "$BranchID" },
          CameraID: { $first: "$CameraID" },
          Timestamp: { $first: "$Timestamp" },
          Total_Person_Count: { $first: "$Total_Person_Count" },
        },
      },
      {
        $project: {
          zone: "$_id.zone",
          dayOfWeek: "$_id.dayOfWeek",
          BranchID: 1,
          CameraID: 1,
          Timestamp: 1,
          Total_Person_Count: 1,
          _id: 0,
        },
      },
    ]);
    let distinctZones = new Set();
    zoneData.map((i) => {
      distinctZones.add(i.zone);
    });
    let result = [];
    let array = Array.from(distinctZones);
    for (let i = 0; i < array.length; i++) {
      let temp = [];
      for (let j = 0; j < zoneData.length; j++) {
        if (zoneData[j].zone == array[i]) {
          temp.push(zoneData[j]);
        }
      }
      var key = array[i],
        obj = {
          [key]: temp,
        };
      result.push(obj);
    }

    for (let i = 0; i < result.length; i++) {
      let key = Object.keys(result[i])[0];
      let subarr = Object.values(result[i])[0];
      let sunCount = 0,
        monCount = 0,
        tueCount = 0,
        wedCount = 0,
        thuCount = 0,
        friCount = 0,
        satCount = 0;
      for (let j = 0; j < subarr.length; j++) {
        switch (subarr[j].dayOfWeek) {
          case 1:
            sunCount = subarr[j].Total_Person_Count;
            break;
          case 2:
            monCount = subarr[j].Total_Person_Count;
            break;
          case 3:
            tueCount = subarr[j].Total_Person_Count;
            break;
          case 4:
            wedCount = subarr[j].Total_Person_Count;
            break;
          case 5:
            thuCount = subarr[j].Total_Person_Count;
            break;
          case 6:
            friCount = subarr[j].Total_Person_Count;
            break;
          case 7:
            satCount = subarr[j].Total_Person_Count;
            break;
        }
      }
      weeklyCordinates = [
        ["Weekly", "Number Of Person Visit"],
        ["Sunday", sunCount],
        ["Monday", monCount],
        ["Tuesday", tueCount],
        ["Wednesday", wedCount],
        ["Thursday", thuCount],
        ["Friday", friCount],
        ["Saturday", satCount],
      ];
      let newKey = key,
        obj = { [newKey]: weeklyCordinates };
      result[i] = obj;
    }
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getTodayData = async (req, res) => {
  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate;
  }
  const { id, type } = req.params;
  const { camera } = req.query;
  var date = new Date();
  date.setHours(0, 0, 0, 0);
  var startOfToday = convertUTCDateToLocalDate(new Date(date));
  try {
    let client = [];

    client = await FootfallAnalysis.find({
      BranchID: id,
      Timestamp: { $gte: startOfToday },
      CameraID: camera,
    });

    if (!client) {
      return res.status(400).json({ msg: "There is no client for this user" });
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
Date.prototype.getWeek = function (dowOffset) {
  dowOffset = typeof dowOffset == "int" ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  var weeknum;
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

exports.deletefootfallObject = async (req, res) => {
  try {
    const user = await FootfallAnalysis.findByIdAndDelete(req.params.id);
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
function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return newDate;
}
exports.getAllData = async (req, res) => {
  let startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  startOfToday = convertUTCDateToLocalDate(new Date(startOfToday));
  try {
    const { camera } = req.query;
    let dates = JSON.parse(req.query.dates);
    const { id, type } = req.params;
    let client = [],
      total = 0;
    const PAGE_SIZE = 10;
    const page = parseInt(req.query.page || "0");
    if (dates.length) {
      total = await FootfallAnalysis.find({
        CameraID: camera,
        Timestamp: { $gte: dates[0], $lte: dates[1] },
        BranchID: id,
      }).countDocuments();
      console.log("Skip", PAGE_SIZE, PAGE_SIZE * page);
      client = await FootfallAnalysis.find({
        BranchID: id,
        Timestamp: { $gte: dates[0], $lte: dates[1] },
        CameraID: camera,
      })
        .sort({ Timestamp: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    } else {
      total = await FootfallAnalysis.find({
        CameraID: camera,
        BranchID: id,
        Timestamp: { $gte: startOfToday },
      }).countDocuments();
      client = await FootfallAnalysis.find({
        CameraID: camera,
        BranchID: id,
        Timestamp: { $gte: startOfToday },
      })
        .sort({ Timestamp: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    }
    if (!client.length) return res.status(200).json({ totalPages: 1, client });
    if (!client) {
      return res.status(400).json({ msg: "There is no client for this user" });
    }
    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), client });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getPdfData = async (req, res) => {
  try {
    const client = await FootfallAnalysis.find({
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

exports.getTodayChart = async (req, res) => {
  try {
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }

    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));

    const { type, id } = req.params;
    const { camera } = req.query;
    let zoneData = [];
    let distinctZones = await FootfallAnalysis.find({
      BranchID: id,
      CameraID: camera,
    }).distinct("Zone");
    if (!distinctZones.length) {
      let response = [
        ["Zone", "Total Person Count", "Current Person Count"],
        ["zone", 0, 0],
      ];
      return res.json(response);
    } else {
      for (let i = 0; i < distinctZones.length; i++) {
        var todayData = await FootfallAnalysis.find({
          BranchID: id,
          Timestamp: { $gte: startOfToday },
          Zone: distinctZones[i],
          CameraID: camera,
        });
        if (todayData.length) {
          zoneData.push(todayData[0]);
        }
      }
      var response = [["Zone", "Total Person Count", "Current Person Count"]];
      zoneData.map((i) => {
        let arrTemp = [
          `${i.Zone}`,
          parseInt(i.Total_Person_Count),
          parseInt(i.Current_Person_Count),
        ];
        response.push(arrTemp);
      });
      res.json(response);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

yearlyData = (data, distinctZones) => {
  // considering 2020 as 1st index
  let tempArr = [];
  // fill an array with empty array having length no. of months+1
  let filledArray = new Array(10).fill([]);
  // according to month fill data on that index
  for (let i = 0; i < data.length; i++) {
    let formattedDate = moment(data[i].Timestamp)
      .utcOffset("-05:30")
      .format("l");
    let arr = formattedDate.split("/");
    tempArr = JSON.parse(arr[2]) - 2019;
    // console.log("arr",tempArr)
    filledArray[tempArr] = [...filledArray[tempArr], data[i]];
  }
  // index having object replace them with only total count
  for (let z = 0; z < filledArray.length; z++) {
    let insideIndexFilledArray = filledArray[z];
    for (let i = 0; i < insideIndexFilledArray.length; i++) {
      for (let j = 0; j < distinctZones.length; j++) {
        if (insideIndexFilledArray[i].Zone !== distinctZones[j]) {
        } else {
          var key = insideIndexFilledArray[i].Zone,
            obj = {
              [key]: insideIndexFilledArray[i].Total_Person_Count,
            };
          insideIndexFilledArray[i] = obj;
        }
      }
    }
  }

  // created summArray and fill with 0 and traverse each object and add value of object on index of district zone in summArray
  let years = [];
  for (let z = 0; z < filledArray.length; z++) {
    let summArray = new Array(distinctZones.length).fill(0);
    var innerArray = filledArray[z];
    for (let i = 0; i < innerArray.length; i++) {
      let innerObject = Object.keys(innerArray[i]);
      for (let j = 0; j < distinctZones.length; j++) {
        if (innerObject[0] === distinctZones[j]) {
          let val = Object.values(innerArray[i]);
          // console.log(val[0])
          summArray[j] += val[0];
        }
      }
    }
    filledArray[z] = [`${z + 2019}`, ...summArray];
  }

  let firstRow = distinctZones;
  firstRow.unshift("Year Wise Analysis");
  filledArray[0] = firstRow;
  return filledArray;
  // console.log(filledArray)
};
monthlyData = (data, distinctZones) => {
  let tempArr = [];
  // fill an array with empty array having length no. of months+1
  let filledArray = new Array(13).fill([]);
  // according to month fill data on that index
  for (let i = 0; i < data.length; i++) {
    let formattedDate = moment(data[i].Timestamp)
      .utcOffset("-05:30")
      .format("l");
    let arr = formattedDate.split("/");
    tempArr = arr[0];
    filledArray[tempArr] = [...filledArray[tempArr], data[i]];
  }
  // index having object replace them with only total count
  for (let z = 0; z < filledArray.length; z++) {
    let insideIndexFilledArray = filledArray[z];
    for (let i = 0; i < insideIndexFilledArray.length; i++) {
      for (let j = 0; j < distinctZones.length; j++) {
        if (insideIndexFilledArray[i].Zone !== distinctZones[j]) {
        } else {
          var key = insideIndexFilledArray[i].Zone,
            obj = {
              [key]: insideIndexFilledArray[i].Total_Person_Count,
            };
          insideIndexFilledArray[i] = obj;
        }
      }
    }
  }
  // created summArray and fill with 0 and traverse each object and add value of object on index of district zone in summArray
  for (let z = 0; z < filledArray.length; z++) {
    let summArray = new Array(distinctZones.length).fill(0);
    var innerArray = filledArray[z];
    for (let i = 0; i < innerArray.length; i++) {
      let innerObject = Object.keys(innerArray[i]);
      for (let j = 0; j < distinctZones.length; j++) {
        if (innerObject[0] === distinctZones[j]) {
          let val = Object.values(innerArray[i]);
          // console.log(val[0])
          summArray[j] += val[0];
        }
      }
    }
    filledArray[z] = [`${z}`, ...summArray];
  }
  let firstRow = distinctZones;
  firstRow.unshift("Month Wise Analysis");
  filledArray[0] = firstRow;
  return filledArray;
};

datelyData = async (data, distinctZones) => {
  let tempArr = [];
  let filledArray = new Array(32).fill([]);
  for (let i = 0; i < data.length; i++) {
    let formattedDate = moment(data[i].Timestamp)
      .utcOffset("-05:30")
      .format("llll");
    let arr = formattedDate.split(" ");
    tempArr = JSON.parse(arr[2].replace(",", ""));
    filledArray[tempArr] = [...filledArray[tempArr], data[i]];
  }
  for (let z = 0; z < filledArray.length; z++) {
    let insideIndexFilledArray = filledArray[z];
    for (let i = 0; i < insideIndexFilledArray.length; i++) {
      for (let j = 0; j < distinctZones.length; j++) {
        if (insideIndexFilledArray[i].Zone !== distinctZones[j]) {
        } else {
          var key = insideIndexFilledArray[i].Zone,
            obj = {
              [key]: insideIndexFilledArray[i].Total_Person_Count,
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
          // console.log(val[0])
          summArray[j] += val[0];
        }
      }
    }
    filledArray[z] = [`${z}`, ...summArray];
  }
  let firstRow = distinctZones;
  firstRow.unshift("Date Wise Analysis");
  filledArray[0] = firstRow;
  return filledArray;
};

exports.getDatesBasedChart = async (req, res) => {
  let requiredxaxis = "",
    variableLength = 0;
  try {
    const { dateObj, camera } = req.body;
    const { type, id } = req.params;
    let greaterThan = dateObj[0];
    let lessThan = dateObj[1];
    let gdate = convertDate(greaterThan);
    let ldate = convertDate(lessThan);
    let garr = gdate.split("/");
    let larr = ldate.split("/");
    if (parseInt(garr[2]) - parseInt(larr[2])) {
      requiredxaxis = "yearlyBase";
    } else if (parseInt(garr[1]) - parseInt(larr[1])) {
      requiredxaxis = "monthlyBase";
    } else if (parseInt(garr[0]) - parseInt(larr[0])) {
      requiredxaxis = "dateBase";
    } else {
      requiredxaxis = "missing";
    }
    switch (requiredxaxis) {
      case "yearlyBase":
        variableLength = parseInt(larr[2]) - parseInt(garr[2]);
        break;
      case "monthlyBase":
        variableLength = parseInt(larr[1]) - parseInt(garr[1]);
        break;
      case "dateBase":
        variableLength = parseInt(larr[0]) - parseInt(garr[0]);
        break;
      default:
        console.log("default case");
    }
    let rangeData = [];
    if (type === "client") {
      rangeData = await FootfallAnalysis.find({
        BranchID: req.params.id,
        Timestamp: { $gte: greaterThan, $lte: lessThan },
        CameraID: camera,
      });
    } else {
      rangeData = await FootfallAnalysis.find({
        ClientID: req.params.id,
        Timestamp: { $gte: greaterThan, $lte: lessThan },
        CameraID: camera,
      });
    }

    if (!rangeData)
      return res
        .status(400)
        .json({ errors: [{ msg: "No data at this time or date" }] });
    let distinctZones = [];
    if (type === "client") {
      distinctZones = await FootfallAnalysis.find({
        BranchID: req.params.id,
        CameraID: camera,
      }).distinct("Zone");
    } else {
      distinctZones = await FootfallAnalysis.find({
        ClientID: req.params.id,
        CameraID: camera,
      }).distinct("Zone");
    }
    var result = [];
    switch (requiredxaxis) {
      case "yearlyBase":
        result = yearlyData(rangeData, distinctZones);
        break;
      case "monthlyBase":
        result = monthlyData(rangeData, distinctZones);
        break;
      case "dateBase":
        result = await datelyData(rangeData, distinctZones);
        break;
    }
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

fetchPdfData = async (id, bothdates, camera) => {
  let startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  try {
    let dates = JSON.parse(bothdates);
    let client = [];
    if (dates.length) {
      client = await FootfallAnalysis.aggregate([
        {
          $match: {
            BranchID: id,
            Timestamp: { $gte: new Date(dates[0]), $lte: new Date(dates[1]) },
            CameraID: { $in: camera },
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
          $unset: [
            "camera.cameraFrame",
            "camera.deviceName",
            "camera.Link",
            "camera.deviceId",
            "camera.cameraStatus",
          ],
        },
        {
          $project: {
            ClientID: 1,
            BranchID: 1,
            CameraID: 1,
            Total_Person_Count: 1,
            Timestamp: 1,
            Zone: 1,
            PercentValue: 1,
            Density: 1,
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
            ClientID: 1,
            BranchID: 1,
            CameraID: 1,
            Current_Person_Count: 1,
            camera: "$camera.cameraName",
            Total_Person_Count: 1,
            Timestamp: 1,
            Zone: 1,
            PercentValue: 1,
            Density: 1,
            branch: 1,
          },
        },
      ]);
    } else {
      client = await FootfallAnalysis.aggregate([
        {
          $match: {
            CameraID: { $in: camera },
            BranchID: id,
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
          $unset: [
            "camera.cameraFrame",
            "camera.deviceName",
            "camera.Link",
            "camera.deviceId",
            "camera.cameraStatus",
          ],
        },
        {
          $project: {
            ClientID: 1,
            BranchID: 1,
            CameraID: 1,
            Total_Person_Count: 1,
            Timestamp: 1,
            Zone: 1,
            PercentValue: 1,
            Density: 1,
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
            ClientID: 1,
            BranchID: 1,
            CameraID: 1,
            Current_Person_Count: 1,
            camera: "$camera.cameraName",
            Total_Person_Count: 1,
            Timestamp: 1,
            Zone: 1,
            PercentValue: 1,
            Density: 1,
            branch: 1,
          },
        },
      ]);
    }
    return client;
  } catch (err) {
    console.error(err.message);
  }
};

exports.generatePdf = async (req, res, next) => {
  try {
    const { id, dates, camera } = req.body;
    let clientData = await fetchPdfData(id, dates, camera);
    let dataValues = [];
    clientData.map((i, index) => {
      let date = moment.parseZone(i.Timestamp);
      let format = date.format("LLL");
      i.Timestamp = format;
      i.camera = i.camera[0];
      (i.ClientID = i.ClientID),
        (i.BranchID = i.BranchID),
        (i.CameraID = i.CameraID),
        (i.Total_Person_Count = i.Total_Person_Count),
        (i.Zone = i.Zone),
        (i.PercentValue = i.PercentValue),
        (i.Density = i.Density),
        (i.branch = i.branch);

      let obj = Object.assign(i);
      obj.key = index + 1;
      dataValues.push(obj);
    });
    res.status(200).send(dataValues);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
