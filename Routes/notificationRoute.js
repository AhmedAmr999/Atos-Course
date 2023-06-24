const express = require("express");
const { check } = require("express-validator");
const notificationsController = require("../Controllers/notifictaionController");
const router = express.Router();

router.get("/", notificationsController.getAllNotifications);

router.post(
  "/addNotification",
  [
    check("examDefinitionName").not().isEmpty(),
    check("examdefinition_id").not().isEmpty(),
    check("examinstance_id").not().isEmpty(),
    check("generated_link").not().isEmpty(),
    check("studentId").not().isEmpty(),
    check("creatorId").not().isEmpty(),
    check("startedtime").not().isEmpty(),
  ],
  notificationsController.addNotification
);

router.get(
  "/getUserNotification/:userId",
  notificationsController.getUserNotification
);

router.get(
  "/getUser/:studentId/examInstance/:examInsatnceId",
  notificationsController.findAndUpdateNotificationWithExamInst
);

router.delete(
  "/deleteNotification/:dnId",
  notificationsController.deleteNotification
);
module.exports = router;
