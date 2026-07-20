const express = require("express");

const authProxy = require("../proxy/auth.proxy");
const {
    authRateLimit,
    refreshRateLimit,
    globalRateLimit
} = require("../middleware/rate-limit.middleware");

const router = express.Router();

/**
 * Public APIs
 */

router.post("/login", authRateLimit, authProxy);

router.post("/register", authProxy);

router.post("/refresh", refreshRateLimit, authProxy);

router.use(globalRateLimit);
router.use("/", authProxy);

module.exports = router;