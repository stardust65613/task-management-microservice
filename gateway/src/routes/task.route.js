const express = require("express");

const taskProxy = require("../proxy/task.proxy");
const authMiddleware = require("../middleware/auth.middleware");
const { globalRateLimit } = require("../middleware/rate-limit.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(globalRateLimit);

// Handle /tasks/*
router.use("/", taskProxy);

module.exports = router;