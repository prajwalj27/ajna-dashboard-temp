const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const MaskDetection = require("../models/maskDetection");
const auth = require("../middleware/auth");
const moment = require("moment");

exports.fetchingMaskDetectionData = async (req, res) => {
  try {
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }

    let startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    startOfToday = convertUTCDateToLocalDate(new Date(startOfToday));
    let dates = JSON.parse(req.query.dates);
    const { camera } = req.query;
    const { id, type } = req.params;
    let client = [],
      total = 0;
    const PAGE_SIZE = 10;
    const page = parseInt(req.query.page || "0");
    if (dates.length) {
      total = await MaskDetection.find({
        BranchID: id,
        Timestamp: { $gte: dates[0], $lte: dates[1] },
        CameraID: camera,
      }).countDocuments();
      client = await MaskDetection.find({
        BranchID: id,
        Timestamp: { $gte: dates[0], $lte: dates[1] },
        CameraID: camera,
      })
        .select("-FaceImage")
        .select("-__v")
        .sort({ Timestamp: -1 })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
    } else {
      total = await MaskDetection.find({
        BranchID: id,
        CameraID: camera,
        Timestamp: { $gte: startOfToday },
      }).countDocuments();
      client = await MaskDetection.find({
        BranchID: id,
        CameraID: camera,
        Timestamp: { $gte: startOfToday },
      })
        .select("-FaceImage")
        .select("-__v")
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

exports.CountDateBased = async (req, res) => {
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
    let dates = JSON.parse(req.body.dates);
    let face = [],
      mask = [],
      obj = [];
    if (type === "client") {
      if (dates.length) {
        (face = []), (mask = []), (obj = []);
        face = await MaskDetection.find({
          BranchID: id,
          Timestamp: { $gte: dates[0], $lte: dates[1] },
          CameraID: camera,
          Face_detected: true,
        }).countDocuments();
        mask = await MaskDetection.find({
          BranchID: id,
          Timestamp: { $gte: dates[0], $lte: dates[1] },
          Mask_detected: true,
          CameraID: camera,
        }).countDocuments();
        let withoutMask = face - mask;
        obj = [face, mask, withoutMask];
      } else {
        (face = []), (mask = []), (obj = []);
        face = await MaskDetection.find({
          BranchID: req.params.id,
          Face_detected: true,
          Timestamp: { $gte: startOfToday },
          CameraID: camera,
        }).countDocuments();
        mask = await MaskDetection.find({
          BranchID: req.params.id,
          Mask_detected: true,
          Timestamp: { $gte: startOfToday },
          CameraID: camera,
        }).countDocuments();
        let withoutMask = face - mask;
        obj = [face, mask, withoutMask];
      }
    } else {
      if (dates.length) {
        (face = []), (mask = []), (obj = []);
        face = await MaskDetection.find({
          ClientID: id,
          Timestamp: { $gte: dates[0], $lte: dates[1] },
          CameraID: camera,
          Face_detected: true,
        }).countDocuments();
        mask = await MaskDetection.find({
          ClientID: id,
          Timestamp: { $gte: dates[0], $lte: dates[1] },
          Mask_detected: true,
          CameraID: camera,
        }).countDocuments();
        let withoutMask = face - mask;
        obj = [face, mask, withoutMask];
      } else {
        (face = []), (mask = []), (obj = []);
        face = await MaskDetection.find({
          ClientID: req.params.id,
          Face_detected: true,
          Timestamp: { $gte: startOfToday },
          CameraID: camera,
        }).countDocuments();
        mask = await MaskDetection.find({
          ClientID: req.params.id,
          Mask_detected: true,
          Timestamp: { $gte: startOfToday },
          CameraID: camera,
        }).countDocuments();
        let withoutMask = face - mask;
        obj = [face, mask, withoutMask];
      }
    }
    res.json(obj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.todayCount = async (req, res) => {
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

    let client = [];
    if (type === "client") {
      client = await MaskDetection.find({
        BranchID: req.params.id,
      });
    } else {
      client = await MaskDetection.find({
        ClientID: req.params.id,
      });
    }
    if (!client) {
      return res.status(400).json({ msg: "There is no client for this user" });
    }
    let facedetected = [],
      maskdetected = [];
    if (type === "client" || type === "admin") {
      facedetected = await MaskDetection.find({
        BranchID: req.params.id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      }).countDocuments();

      maskdetected = await MaskDetection.find({
        BranchID: req.params.id,
        Timestamp: { $gte: startOfToday },
        Mask_detected: true,
        CameraID: camera,
      }).countDocuments();
    } else {
      facedetected = await MaskDetection.find({
        ClientID: req.params.id,
        Timestamp: { $gte: startOfToday },
        CameraID: camera,
      }).countDocuments();

      maskdetected = await MaskDetection.find({
        ClientID: req.params.id,
        Timestamp: { $gte: startOfToday },
        Mask_detected: true,
        CameraID: camera,
      }).countDocuments();
    }
    let count = [{ facedetected }, { maskdetected }];

    res.json(count);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addNewData = async (req, res) => {
  const {
    ClientID,
    BranchID,
    Timestamp,
    CameraID,
    FaceImage,
    Face_detected,
    Mask_detected,
  } = req.body;
  try {
    let client = await MaskDetection.findOne({ ClientID });
    let data = {
      ClientID,
      BranchID,
      Timestamp,
      CameraID,
      FaceImage,
      Face_detected,
      Mask_detected,
    };
    try {
      client = new MaskDetection(data);
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

exports.fetchingDateBasedChart = async (req, res) => {
  let requiredxaxis = "",
    variableLength = 0;
  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
  }
  try {
    const { type, id } = req.params;
    const { dateObj } = req.body;
    const { camera } = req.body;
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
      rangeData = await MaskDetection.find({
        BranchID: req.params.id,
        Timestamp: { $gte: greaterThan, $lte: lessThan },
        CameraID: camera,
      }).select("-FaceImage");
    } else {
      rangeData = await MaskDetection.find({
        ClientID: req.params.id,
        Timestamp: { $gte: greaterThan, $lte: lessThan },
        CameraID: camera,
      }).select("-FaceImage");
    }
    if (!rangeData)
      return res
        .status(400)
        .json({ errors: [{ msg: "No data at this time or date" }] });
    var result = [];
    let tempArr = [];
    let filledArray = [];
    switch (requiredxaxis) {
      case "yearlyBase":
        filledArray = new Array(10).fill([]);

        for (let i = 0; i < rangeData.length; i++) {
          let formattedDate = moment(rangeData[i].Timestamp)
            .utcOffset("-05:30")
            .format("l");
          let arr = formattedDate.split("/");
          tempArr = JSON.parse(arr[2]) - 2019;
          // console.log("arr",tempArr)
          filledArray[tempArr] = [...filledArray[tempArr], rangeData[i]];
        }

        for (let z = 0; z < filledArray.length; z++) {
          let insideIndexFilledArray = filledArray[z];
          let maskDetect = 0,
            withoutMaskDetect = 0,
            faceDetect = 0;
          for (let i = 0; i < insideIndexFilledArray.length; i++) {
            if (
              insideIndexFilledArray[i].Face_detected &&
              !insideIndexFilledArray[i].Mask_detected
            ) {
              withoutMaskDetect++;
            }
            if (insideIndexFilledArray[i].Face_detected) {
              faceDetect++;
            }
            if (insideIndexFilledArray[i].Mask_detected) {
              maskDetect++;
            }
          }
          filledArray[z] = [
            `${z + 2019}`,
            faceDetect,
            maskDetect,
            withoutMaskDetect,
          ];
        }
        filledArray[0] = [
          "Year",
          "Face Detected",
          "Mask Detected",
          "Without Mask",
        ];
        result = filledArray;
        break;
      case "monthlyBase":
        filledArray = new Array(13).fill([]);
        for (let i = 0; i < rangeData.length; i++) {
          let formattedDate = moment(rangeData[i].Timestamp)
            .utcOffset("-05:30")
            .format("l");
          let arr = formattedDate.split("/");
          tempArr = arr[0];
          filledArray[tempArr] = [...filledArray[tempArr], rangeData[i]];
        }
        for (let z = 0; z < filledArray.length; z++) {
          let insideIndexFilledArray = filledArray[z];
          let maskDetect = 0,
            withoutMaskDetect = 0,
            faceDetect = 0;
          for (let i = 0; i < insideIndexFilledArray.length; i++) {
            if (
              insideIndexFilledArray[i].Face_detected &&
              !insideIndexFilledArray[i].Mask_detected
            ) {
              withoutMaskDetect++;
            }
            if (insideIndexFilledArray[i].Face_detected) {
              faceDetect++;
            }
            if (insideIndexFilledArray[i].Mask_detected) {
              maskDetect++;
            }
          }
          filledArray[z] = [`${z}`, faceDetect, maskDetect, withoutMaskDetect];
        }
        filledArray[0] = [
          "Month",
          "Face Detected",
          "Mask Detected",
          "Without Mask",
        ];
        result = filledArray;
        break;
      case "dateBase":
        filledArray = new Array(32).fill([]);
        for (let i = 0; i < rangeData.length; i++) {
          let formattedDate = moment(rangeData[i].Timestamp)
            .utcOffset("-05:30")
            .format("llll");
          let arr = formattedDate.split(" ");
          tempArr = JSON.parse(arr[2].replace(",", ""));
          filledArray[tempArr] = [...filledArray[tempArr], rangeData[i]];
        }
        for (let z = 0; z < filledArray.length; z++) {
          let insideIndexFilledArray = filledArray[z];
          let maskDetect = 0,
            withoutMaskDetect = 0,
            faceDetect = 0;
          for (let i = 0; i < insideIndexFilledArray.length; i++) {
            if (
              insideIndexFilledArray[i].Face_detected &&
              !insideIndexFilledArray[i].Mask_detected
            ) {
              withoutMaskDetect++;
            }
            if (insideIndexFilledArray[i].Face_detected) {
              faceDetect++;
            }
            if (insideIndexFilledArray[i].Mask_detected) {
              maskDetect++;
            }
          }
          filledArray[z] = [`${z}`, faceDetect, maskDetect, withoutMaskDetect];
        }
        filledArray[0] = [
          "Date",
          "Face Detected",
          "Mask Detected",
          "Without Mask",
        ];
        result = filledArray;
        break;
    }
    res.json(result);
  } catch (error) {
    console.error(error.message);
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
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
weekday = new Array("Sun,", "Mon,", "Tue,", "Wed,", "Thu,", "Fri,", "Sat,");
var dayOfWeek = weekday[today.getDay()];
var currentWeekNumber = today.getWeek();

exports.getWeeklyBasedData = async (req, res) => {
  let weeklyCordinates = [];
  let tempDate = new Date();
  tempDate.setDate(today.getDate() - 8);
  let sunMask = 0,
    monMask = 0,
    tueMask = 0,
    wedMask = 0,
    thuMask = 0,
    friMask = 0,
    satMask = 0;
  let sunWithoutMask = 0,
    monWithoutMask = 0,
    tueWithoutMask = 0,
    wedWithoutMask = 0,
    thuWithoutMask = 0,
    friWithoutMask = 0,
    satWithoutMask = 0;

  try {
    const { id, type } = req.params;
    const { camera } = req.body;
    let weeklyData = [];
    if (type === "client" || type === "admin") {
      weeklyData = await MaskDetection.find({
        BranchID: id,
        Timestamp: { $gte: tempDate },
        CameraID: camera,
      }).select("-FaceImage");
    } else {
      weeklyData = await MaskDetection.find({
        ClientID: req.params.id,
        Timestamp: { $gte: tempDate },
        CameraID: camera,
      }).select("-FaceImage");
    }
    if (!weeklyData)
      return res
        .status(400)
        .json({ errors: [{ msg: "No data at this time or date" }] });
    weeklyData.map((i) => {
      let formattedDate = moment(i.Timestamp)
        .utcOffset("-05:30")
        .format("llll");
      let arr = formattedDate.split(" ");
      if (i.Timestamp.getWeek() === currentWeekNumber) {
        switch (arr[0]) {
          case "Sun,":
            i.Mask_detected ? sunMask++ : sunWithoutMask++;
            break;
          case "Mon,":
            i.Mask_detected ? monMask++ : monWithoutMask++;
            break;
          case "Tue,":
            i.Mask_detected ? tueMask++ : tueWithoutMask++;
            break;
          case "Wed,":
            i.Mask_detected ? wedMask++ : wedWithoutMask++;
            break;
          case "Thu,":
            i.Mask_detected ? thuMask++ : thuWithoutMask++;
            break;
          case "Fri,":
            i.Mask_detected ? friMask++ : friWithoutMask++;
            break;
          case "Sat,":
            i.Mask_detected ? satMask++ : satWithoutMask++;
            break;
        }
      }
      weeklyCordinates = [
        ["Weekly", "With Mask", "Without Mask"],
        ["Sunday", sunMask, sunWithoutMask],
        ["Monday", monMask, monWithoutMask],
        ["Tuesday", tueMask, tueWithoutMask],
        ["Wednesday", wedMask, wedWithoutMask],
        ["Thursday", thuMask, thuWithoutMask],
        ["Friday", friMask, friWithoutMask],
        ["Saturday", satMask, satWithoutMask],
      ];
    });
    res.json(weeklyCordinates);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getImage = async (req, res) => {
  try {
    // console.log(req.params.id);
    var img = await MaskDetection.findById(req.params.id).select("FaceImage");
    if (!img) {
      return res.status(400).json({ msg: "There is no image for this user" });
    }
    res.send(img);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getDistinctCamera = async (req, res) => {
  try {
    var camera = await MaskDetection.find({ ClientID: req.params.id }).distinct(
      "CameraID"
    );
    if (!camera) {
      return res.status(400).json({ msg: "Server Error" });
    }
    res.send(camera);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
