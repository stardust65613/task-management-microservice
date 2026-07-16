const express = require("express");

const userProxy = require("../proxy/user.proxy");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.use("/", userProxy);

module.exports = router;