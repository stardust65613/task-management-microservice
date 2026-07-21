const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const projectRoutes = require("./project.route");
const taskRoutes = require("./task.route");
const fileRoutes = require("./file.route");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/files", fileRoutes);


module.exports = router;