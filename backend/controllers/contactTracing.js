const express = require("express");
const router = express.Router();
const Client = require("../models/Clients");
const Branch = require("../models/Branch");
const ContactTracing = require("../models/ContactTracing");
const auth = require("../middleware/auth");

exports.getContactTracingData = async (req, res) => {
  try {
    let dates = JSON.parse(req.body.dates);
    const { camera } = req.body;
    const { id, type } = req.params;
    let client = [];
    if (dates.length) {
      client = await ContactTracing.find({
        BranchID: id,
        Timestamp: { $gte: dates[0], $lte: dates[1] },
        CameraID: camera,
      }).select("-img");
      // .sort({ Timestamp: -1 });
    } else {
      client = await ContactTracing.find({
        BranchID: id,
        CameraID: camera,
      })
        .select("-img")
        .sort({ Timestamp: -1 })
        .limit(25);
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

exports.addNewData = async (req, res) => {
  const {
    ClientID,
    BranchID,
    PersonID,
    ContactedPersonID,
    Timestamp,
    CameraID,
    img,
  } = req.body;
  try {
    let client = await ContactTracing.findOne({ ClientID });
    let data = {
      ClientID,
      BranchID,
      PersonID,
      ContactedPersonID,
      Timestamp,
      CameraID,
      img,
    };
    try {
      client = new ContactTracing(data);
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

exports.getTodayGraphCoordinates = async (req, res) => {
  let personId = [],
    contactedPersonId = [];
  let result = [];

  let startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  try {
    var todayData = await ContactTracing.find({
      ClientID: req.params.id,
      Timestamp: { $gte: startOfToday },
    }).select("-img");
    if (todayData.length) {
      todayData.map((i) => {
        personId.unshift(i.PersonID);
        contactedPersonId.unshift(i.ContactedPersonID);
      });

      result.push(personId);
      result.push(contactedPersonId);
    }
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getAllGraphCoordinates = async (req, res) => {
  try {
    let dates = JSON.parse(req.body.dates);
    let { camera } = req.body;
    let { id, type } = req.params;
    let personId = [],
      contactedPersonId = [];
    let result = [];
    let allData = [];
    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));
    if (dates.length) {
      allData = await ContactTracing.find({
        BranchID: id,
        CameraID: camera,
        Timestamp: { $gte: dates[0], $lte: dates[1] },
      }).select("-img");
    } else {
      allData = await ContactTracing.find({
        BranchID: id,
        CameraID: camera,
        Timestamp: { $gte: startOfToday },
      }).select("-img");
    }

    if (allData.length) {
      allData.map((i) => {
        personId.unshift(i.PersonID);
        contactedPersonId.unshift(i.ContactedPersonID);
      });
    }

    result.push(personId);
    result.push(contactedPersonId);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getImage = async (req, res) => {
  try {
    var img = await ContactTracing.findById(req.params.id).select("img");
    if (!img) {
      return res.status(400).json({ msg: "There is no image for this user" });
    }
    res.send(img);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.distinctCamera = async (req, res) => {
  try {
    var camera = await ContactTracing.find({
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
