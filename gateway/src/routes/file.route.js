const express = require("express");

const fileProxy = require("../proxy/file.proxy");
const authMiddleware = require("../middleware/auth.middleware");
const { globalRateLimit } = require("../middleware/rate-limit.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(globalRateLimit);

router.use("/", fileProxy);

module.exports = router;