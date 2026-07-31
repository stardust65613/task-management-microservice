const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const projectRoutes = require("./project.route");
const taskRoutes = require("./task.route");
const fileRoutes = require("./file.route");
const taskProjectRoutes = require("./task-project.route");
const commentRoutes = require("./comment.route");
const notificationRoutes = require("./notification.route");

const router = express.Router();

router.use("/projects/:projectId/tasks", taskProjectRoutes);
router.use("/notifications", notificationRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/files", fileRoutes);
router.use("/tasks", taskRoutes);
router.use("/comments", commentRoutes)

module.exports = router;