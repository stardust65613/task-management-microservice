const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const taskRoutes = require("./task.route");
const commentRoutes = require("./comment.route");
const attachmentRoutes = require("./attachment.route");

const router = express.Router();

router.use(authenticate);

router.use(taskRoutes);
router.use(commentRoutes);
router.use(attachmentRoutes);

module.exports = router;