const express = require("express");
var awsIot = require("aws-iot-device-sdk");
const router = express.Router();
var device = awsIot.device({
  keyPath: "routes/certs/private.pem.key",
  certPath: "routes/certs/device.pem.crt",
  caPath: "routes/certs/Amazon-root-CA-1.pem",
  clientId: "iotconsole-1599027591828-2",
  host: "a1ijrpymlcgmvv-ats.iot.us-east-2.amazonaws.com",
});

device.on("connect", () => {
  console.log("aws connected");
});
device.on("close", function () {
  console.log("aws close");
});
device.on("error", function () {
  console.log("aws error");
});
device.on("offline", function () {
  console.log("aws offline");
});
router.post("/", async (req, res) => {
  try {
    const { trigger } = req.body;
    console.log(trigger);
    // let publishFun = async () => {
    device.publish("trigger", trigger, 1);
    // console.log("recursion");
    // };
    res.send("trigger published");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
