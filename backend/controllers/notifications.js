const Notification = require("../models/Notification");
const moment = require("moment");

exports.getTodayBranchNotifications = async (req, res) => {
  const { branchId, cameraId } = req.query;
  try {
    function convertUTCDateToLocalDate(date) {
      let newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    var startOfToday = convertUTCDateToLocalDate(new Date(date));
    let notifications = await Notification.aggregate([
      {
        $match: {
          BranchID: branchId,
          CameraID: {
            $in: cameraId,
          },
          priority: "low",
          created_at: { $gte: startOfToday },
        },
      },
    ]);
    return res.status(200).send(notifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getWeeklyBranchNotification = async (req, res) => {
  const { branchId, cameraId } = req.query;
  try {
    function convertUTCDateToLocalDate(date) {
      let newDate = new Date(date);
      newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return newDate;
    }
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - 8);
    tempDate.setHours(0, 0, 0, 0);
    let startOfToday = convertUTCDateToLocalDate(new Date(tempDate));

    let notifications = await Notification.aggregate([
      {
        $match: {
          BranchID: branchId,
          CameraID: {
            $in: cameraId,
          },
          created_at: {
            $gte: moment().startOf("isoweek").toDate(),
            $lt: moment().endOf("isoweek").toDate(),
          },
        },
      },
    ]);
    if (!notifications.length) {
      notifications = await Notification.aggregate([
        {
          $match: {
            BranchID: branchId,
            CameraID: {
              $in: cameraId,
            },
          },
        },
      ])
        .limit(20)
        .sort({ created_at: -1 });
    }
    return res.status(200).send(notifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
exports.insertFootfall = async (data) => {
  try {
    const { ClientID, BranchID, CameraID, Timestamp, Zone, Density } = data;
    let notification = new Notification({
      ClientID,
      BranchID,
      CameraID,
      message: `Person entered into ${Zone}`,
      priority: "low",
      created_at: Timestamp,
    });
    await notification.save();
    return;
  } catch (error) {
    console.error(error.message);
    return;
  }
};
exports.updateFootfall = async (data) => {
  try {
    const { ClientID, BranchID, CameraID, Timestamp, Zone, Density } = data;
    let notification = new Notification({
      ClientID,
      BranchID,
      CameraID,
      message: `Person entered into ${Zone}`,
      priority: "low",
      created_at: Timestamp,
    });
    await notification.save();
    return;
  } catch (error) {
    console.error(error.message);
    return;
  }
};

exports.insertMaskNotification = async (data) => {
  try {
    const { ClientID, BranchID, CameraID, Timestamp, Zone, Density } = data;
    let notification = new Notification({
      ClientID,
      BranchID,
      CameraID,
      message: `Person without mask entered`,
      priority: "low",
      created_at: Timestamp,
    });
    await notification.save();
    return;
  } catch (error) {
    console.error(error.message);
    return;
  }
};
exports.updateMaskNotification = async (data) => {
  try {
    const { ClientID, BranchID, CameraID, Timestamp, Zone, Density } = data;
    let notification = new Notification({
      ClientID,
      BranchID,
      CameraID,
      message: `Person without mask entered`,
      priority: "low",
      created_at: Timestamp,
    });
    await notification.save();
    return;
  } catch (error) {
    console.error(error.message);
    return;
  }
};

exports.insertDwellTimeNotification = async (data) => {
  try {
    let { ClientID, BranchID, CameraID, Zone } = data;
    let Timestamp = "",
      TimeSpent = "",
      PersonID = "";
    data.passerBy.map((item) => {
      if (item.Threshold) {
        (Timestamp = item.Timestamp),
          (TimeSpent = item.TimeSpent),
          (PersonID = item.PersonID);
      }
    });
    let notification = new Notification({
      ClientID,
      BranchID,
      CameraID,
      message: `Person ${PersonID} Spent ${TimeSpent}ms in ${Zone}`,
      priority: "low",
      created_at: Timestamp,
    });
    await notification.save();
    return;
  } catch (error) {
    console.error(error.message);
    return;
  }
};
exports.updateDwellTimeNotification = async (data) => {
  try {
    let { ClientID, BranchID, CameraID, Zone, TimeSpent } = data;
    (Timestamp = ""), (TimeSpent = ""), (PersonID = "");
    data.passerBy.map((item) => {
      if (item.Threshold) {
        (Timestamp = item.Timestamp),
          (TimeSpent = item.TimeSpent),
          (PersonID = item.PersonID);
      }
    });
    let notification = new Notification({
      ClientID,
      BranchID,
      CameraID,
      message: `Person ${PersonID} Spent ${TimeSpent}ms in ${Zone}`,
      priority: "low",
      created_at: Timestamp,
    });
    await notification.save();
    return;
  } catch (error) {
    console.error(error.message);
    return;
  }
};
