const express = require("express");

const notificationProxy = require("../proxy/notification.proxy");
const authMiddleware = require("../middleware/auth.middleware");
const { globalRateLimit } = require("../middleware/rate-limit.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(globalRateLimit);

router.use("/", notificationProxy);

module.exports = router;