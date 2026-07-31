const express = require("express");
const notificationController = require("../controllers/notification.controller");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticate, notificationController.GetNotifications);

router.get("/:notifyId", authenticate, notificationController.GetNotification);

router.patch("/:notifyId/read", authenticate, notificationController.MarkAsRead);

router.patch("/read", authenticate, notificationController.MarkAllAsRead);

router.delete("/:notifyId", authenticate, notificationController.DeleteNotification);

module.exports = router;