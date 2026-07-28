const express = require("express");
const taskController = require("../controllers/task.controller");

const router = express.Router();

router.post("/projects/:projectId/tasks", taskController.CreateTask);
router.get("/projects/:projectId/tasks", taskController.GetTasksByProject);
router.get("/projects/:projectId/tasks/search", taskController.SearchTask);
router.get("/projects/:projectId/tasks/assignee/:userId", taskController.GetTaskByAssignee);
router.get("/tasks/my", taskController.GetMyTasks);
router.get("/tasks/overdue", taskController.GetOverdueTasks);
router.get("/projects/:projectId/tasks/statistics", taskController.GetTasksStatistics);
router.get("/tasks/:taskId", taskController.GetTaskDetail);
router.patch("/tasks/:taskId", taskController.UpdateTask);
router.patch("/tasks/:taskId/assignee", taskController.AssignTask);
router.delete("/tasks/:taskId", taskController.DeleteTask);

module.exports = router;