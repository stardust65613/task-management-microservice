const express = require("express");

const projectProxy = require("../proxy/project.proxy");
const authMiddleware = require("../middleware/auth.middleware");
const { globalRateLimit } = require("../middleware/rate-limit.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(globalRateLimit);

router.use("/", projectProxy);

module.exports = router;