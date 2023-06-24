const HttpError = require("../Models/http-error");
const expressValidator = require("express-validator");
const { validationResult } = require("express-validator");
const Notification = require("../Models/notificationModel");
const produceMessage = require("../producer/index");

const getAllNotifications = async (req, res, next) => {
  let notifications;
  try {
    notifications = await Notification.find();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "fetching notifications failed please try again later ",
        500
      )
    );
  }
  const generatedLinks = notifications.map(
    (notification) => notification.generated_link
  );
  console.log("Generated links:", generatedLinks);
  res.json({
    notifications,
  });
};

const addNotification = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }
  produceMessage(req.body);

  res.status(201).json({ message: "notification Created Successfully" });
};

const getUserNotification = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(
        new HttpError("Invalid Inputs passed,please check your data"),
        422
      );
    }
    const userId = req.params.userId;
    let notification;
    try {
      notification = await Notification.find({
        $or: [{ studentId: userId }, { creatorId: userId }],
      });
    } catch (error) {
      return next(
        new HttpError("Something went wrong, could not find notification.", 500)
      );
    }

    if (!notification || notification.length === 0) {
      return res.status(404).json({
        message: "Cannot find notification with the given user ID.",
      });
    }

    res.status(200).json({
      message: "Found Notifications of User Successfully",
      notification: notification,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Inputs passed,please check your data"),
      422
    );
  }
  let notification;
  const dnId = req.params.dnId;
  try {
    notification = await Notification.find({ examinstance_id: dnId });
  } catch (error) {
    return next(
      new HttpError(
        "something went wrong could not find and del notification..",
        500
      )
    );
  }

  if (notification.length === 0) {
    return res.status(404).json({
      message: "Cannot find notification.",
    });
  }

  if (!notification) {
    return next(
      new HttpError("something went wrong could not find notification..", 404)
    );
  }

  try {
    await Notification.deleteMany({ examinstance_id: dnId });
  } catch (error) {
    return next(
      new HttpError("something went wrong could not delete notification..", 500)
    );
  }
  res.status(200).json({
    message: "Notification Deleted Successfully",
  });
};

const findAndUpdateNotificationWithExamInst = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(
        new HttpError("Invalid Inputs passed,please check your data"),
        422
      );
    }

    const examInsatnceId = req.params.examInsatnceId;
    const studentId = req.params.studentId;
    let notification;
    try {
      notification = await Notification.find({
        $and: [{ studentId: studentId }, { examinstance_id: examInsatnceId }],
      });
    } catch (error) {
      return next(
        new HttpError("something went wrong could not find notification..", 500)
      );
    }

    if (!notification) {
      return next(
        new HttpError("something went wrong could not find notification..", 404)
      );
    }

    if (notification.length === 0) {
      return res.status(404).json({
        message:
          "Cannot find notification with the given user ID and exam instance ID",
      });
    }

    try {
      await Notification.updateMany(
        {
          $and: [{ studentId: studentId }, { examinstance_id: examInsatnceId }],
        },
        { $set: { testTaken: "taken" } }
      );
    } catch (error) {
      return next(
        new HttpError(
          "Something went wrong, could not update notification.",
          500
        )
      );
    }

    res.status(200).json({
      message: "Update Notification of User Successfully",
    });
  } catch (error) {}
};

const updateUserTakeExam = async (req, res, next) => {
  try {
    const examInsatnceId = req.params.examInsatnceId;
    const studentId = req.params.studentId;
    let notification;
    try {
      notification = await Notification.find({
        $and: [{ studentId: studentId }, { examinstance_id: examInsatnceId }],
      });
    } catch (error) {
      return next(
        new HttpError("something went wrong could not find notification..", 500)
      );
    }
  } catch (error) {}
};

exports.getAllNotifications = getAllNotifications;
exports.addNotification = addNotification;
exports.getUserNotification = getUserNotification;
exports.findAndUpdateNotificationWithExamInst =
  findAndUpdateNotificationWithExamInst;
exports.deleteNotification = deleteNotification;
