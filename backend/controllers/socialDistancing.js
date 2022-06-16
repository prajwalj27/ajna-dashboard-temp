const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const SocialDistancing = require("../models/SocialDistancing");
const auth = require("../middleware/auth");

exports.getCount = async (req, res) => {
  try {
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    const { id, type } = req.params;
    const { camera } = req.body;
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));
    let violations = [];
    if (type === "client" || type === "admin") {
      violations = await SocialDistancing.find({
        BranchID: id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      }).countDocuments();
    } else {
      console.log("start", startOfToday);
      violations = await SocialDistancing.find({
        ClientID: id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      }).countDocuments();
    }
    if (!violations) {
      return res.json(0);
    }
    res.json(violations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getSocialDistancingData = async (req, res) => {
  try {
    let { camera } = req.body;
    let { id, type } = req.params;
    let dates = JSON.parse(req.body.dates);
    let client = [];
    if (type === "client" || type === "admin") {
      if (dates.length) {
        client = await SocialDistancing.find({
          BranchID: id,
          Timestamp: { $gte: dates[0], $lte: dates[1] },
          CameraID: camera,
        }).select("-Image");
      } else {
        client = await SocialDistancing.find({
          BranchID: id,
          CameraID: camera,
        }).select("-Image");
      }
    } else {
      if (dates.length) {
        client = await SocialDistancing.find({
          ClientID: id,
          Timestamp: { $gte: dates[0], $lte: dates[1] },
          CameraID: camera,
        }).select("-Image");
      } else {
        client = await SocialDistancing.find({
          ClientID: id,
          CameraID: camera,
        }).select("-Image");
      }
    }
    if (!client) {
      return res.status(400).json({ msg: "There is no client for this user" });
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteObj = async (req, res) => {
  try {
    const users = await SocialDistancing.findByIdAndDelete(req.params.id);
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getImage = async (req, res) => {
  try {
    var img = await SocialDistancing.findById(req.params.id).select("Image");
    if (!img) {
      return res.status(400).json({ msg: "There is no image for this user" });
    }
    res.send(img);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.todayData = async (req, res) => {
  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate;
  }
  const { id, type } = req.params;
  const { camera } = req.body;
  var date = new Date();
  date.setHours(0, 0, 0, 0);
  var startOfToday = convertUTCDateToLocalDate(new Date(date));
  try {
    let client = [];
    if (type === "client" || type === "admin") {
      client = await SocialDistancing.findOne({
        BranchID: id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      })
        .select("-Image")
        .sort({ Timestamp: -1 })
        .limit(1);
    } else {
      client = await SocialDistancing.findOne({
        ClientID: id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      })
        .select("-Image")
        .sort({ Timestamp: -1 })
        .limit(1);
    }
    if (!client) {
      return res.send({});
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.AddNewData = async (req, res) => {
  const {
    ClientID,
    BranchID,
    CameraID,
    Timestamp,
    PersonID,
    Contacted_PersonID,
    Image,
    current_violation_index,
    today_violation_index,
    Zone,
  } = req.body;
  try {
    let client = await SocialDistancing.findOne({ ClientID });

    let data = {
      ClientID,
      CameraID,
      BranchID,
      Timestamp,
      PersonID,
      Contacted_PersonID,
      Image,
      current_violation_index,
      today_violation_index,
      Zone,
    };
    try {
      client = new SocialDistancing(data);
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
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
weekday = new Array("Sun,", "Mon,", "Tue,", "Wed,", "Thu,", "Fri,", "Sat,");
var dayOfWeek = weekday[today.getDay()];
var currentWeekNumber = today.getWeek();

exports.getTodayCoordinates = async (req, res) => {
  let zoneData = [];
  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return newDate;
  }
  const { id, type } = req.params;
  const { camera } = req.body;
  var date = new Date();
  date.setHours(0, 0, 0, 0);
  var startOfToday = convertUTCDateToLocalDate(new Date(date));
  try {
    let distinctZones = [];
    if (type === "client" || type === "admin") {
      distinctZones = await SocialDistancing.find({
        BranchID: id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      }).distinct("Zone");
    } else {
      distinctZones = await SocialDistancing.find({
        ClientID: id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      }).distinct("Zone");
    }
    if (!distinctZones.length) {
      let response = [
        ["Zone", "Current Violation Index", "Today Violation Index"],
        ["zone", 0, 0],
      ];
      return res.json(response);
    } else {
      for (let i = 0; i < distinctZones.length; i++) {
        var todayData = [];
        if (type === "client" || type === "admin") {
          todayData = await SocialDistancing.find({
            BranchID: id,
            Timestamp: { $gte: startOfToday },
            Zone: distinctZones[i],
            CameraID: camera,
          }).select("-Image");
        } else {
          todayData = await SocialDistancing.find({
            ClientID: id,
            Timestamp: { $gte: startOfToday },
            Zone: distinctZones[i],
            CameraID: camera,
          }).select("-Image");
        }
        if (todayData.length) {
          zoneData.push(todayData[0]);
        }
      }
      var response = [
        ["Zone", "Current Violation Index", "Today Violation Index"],
      ];

      zoneData.map((i) => {
        let arrTemp = [
          `${i.Zone}`,
          parseInt(i.current_violation_index),
          parseInt(i.today_violation_index),
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

exports.getDistinctCamera = async (req, res) => {
  try {
    var camera = await SocialDistancing.find({
      ClientID: req.params.id,
    }).distinct("CameraID");
    if (!camera) {
      return res.status(400).json({ msg: "Server Error" });
    }
    res.send(camera);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
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
};

exports.getDateBasedData = async (req, res) => {
  let requiredxaxis = "";
  try {
    const { dateObj, camera } = req.body;
    const { id, type } = req.params;
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
    if (type === "client" || type === "admin") {
      rangeData = await SocialDistancing.find({
        BranchID: req.params.id,
        Timestamp: { $gte: greaterThan, $lte: lessThan },
        CameraID: camera,
      }).select("-Image");
    } else {
      rangeData = await SocialDistancing.find({
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
    if (type === "client" || type === "admin") {
      distinctZones = await SocialDistancing.find({
        BranchID: req.params.id,
        CameraID: camera,
      }).distinct("Zone");
    } else {
      distinctZones = await SocialDistancing.find({
        ClientID: req.params.id,
        CameraID: camera,
      }).distinct("Zone");
    }
    var result = [];
    let tempArr = [],
      filledArray = [],
      firstRow = [];
    switch (requiredxaxis) {
      case "yearlyBase":
        //  result= yearlyData(rangeData, distinctZones);
        tempArr = [];
        // fill an array with empty array having length no. of months+1
        filledArray = new Array(10).fill([]);
        // according to month fill data on that index
        for (let i = 0; i < rangeData.length; i++) {
          let formattedDate = moment(rangeData[i].Timestamp)
            .utcOffset("-05:30")
            .format("l");
          let arr = formattedDate.split("/");
          tempArr = JSON.parse(arr[2]) - 2019;
          // console.log("arr",tempArr)
          filledArray[tempArr] = [...filledArray[tempArr], rangeData[i]];
        }
        for (let i = 0; i < filledArray.length; i++) {
          let innerArray = filledArray[i];
          let replaceArr = [];
          for (let j = 0; j < distinctZones.length; j++) {
            let zonesArray = innerArray.filter((i) => {
              return i.Zone === distinctZones[j];
            });
            replaceArr.push(zonesArray);
          }
          filledArray[i] = replaceArr;
        }
        for (let z = 0; z < filledArray.length; z++) {
          let insideIndexFilledArray = filledArray[z];
          for (let i = 0; i < insideIndexFilledArray.length; i++) {
            let zoneBasedArr = insideIndexFilledArray[i];
            insideIndexFilledArray[i] = zoneBasedArr.length;
          }
          insideIndexFilledArray.unshift(`${z + 2019}`);
        }
        firstRow = distinctZones;
        firstRow.unshift("Year Wise Analysis");
        filledArray[0] = firstRow;
        result = filledArray;
        break;
      case "monthlyBase":
        tempArr = [];
        // fill an array with empty array having length no. of months+1
        filledArray = new Array(13).fill([]);
        // according to month fill data on that index
        for (let i = 0; i < rangeData.length; i++) {
          let formattedDate = moment(rangeData[i].Timestamp)
            .utcOffset("-05:30")
            .format("l");
          let arr = formattedDate.split("/");
          tempArr = arr[0];
          filledArray[tempArr] = [...filledArray[tempArr], rangeData[i]];
        }
        for (let i = 0; i < filledArray.length; i++) {
          let innerArray = filledArray[i];
          let replaceArr = [];
          for (let j = 0; j < distinctZones.length; j++) {
            let zonesArray = innerArray.filter((i) => {
              return i.Zone === distinctZones[j];
            });
            replaceArr.push(zonesArray);
          }
          filledArray[i] = replaceArr;
        }
        for (let z = 0; z < filledArray.length; z++) {
          let insideIndexFilledArray = filledArray[z];
          for (let i = 0; i < insideIndexFilledArray.length; i++) {
            let zoneBasedArr = insideIndexFilledArray[i];
            insideIndexFilledArray[i] = zoneBasedArr.length;
          }
          insideIndexFilledArray.unshift(`${z}`);
        }
        firstRow = distinctZones;
        firstRow.unshift("Month Wise Analysis");
        filledArray[0] = firstRow;
        result = filledArray;

        // console.log("filled", filledArray);
        break;
      case "dateBase":
        tempArr = [];
        filledArray = new Array(32).fill([]);
        for (let i = 0; i < rangeData.length; i++) {
          let formattedDate = moment(rangeData[i].Timestamp)
            .utcOffset("-05:30")
            .format("llll");
          let arr = formattedDate.split(" ");
          tempArr = JSON.parse(arr[2].replace(",", ""));
          filledArray[tempArr] = [...filledArray[tempArr], rangeData[i]];
        }
        for (let i = 0; i < filledArray.length; i++) {
          let innerArray = filledArray[i];
          let replaceArr = [];
          for (let j = 0; j < distinctZones.length; j++) {
            let zonesArray = innerArray.filter((i) => {
              return i.Zone === distinctZones[j];
            });
            replaceArr.push(zonesArray);
          }
          filledArray[i] = replaceArr;
        }
        for (let z = 0; z < filledArray.length; z++) {
          let insideIndexFilledArray = filledArray[z];
          for (let i = 0; i < insideIndexFilledArray.length; i++) {
            let zoneBasedArr = insideIndexFilledArray[i];
            insideIndexFilledArray[i] = zoneBasedArr.length;
          }
          insideIndexFilledArray.unshift(`${z}`);
        }
        firstRow = distinctZones;
        firstRow.unshift("Date Wise Analysis");
        filledArray[0] = firstRow;
        result = filledArray;
        break;
    }
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
