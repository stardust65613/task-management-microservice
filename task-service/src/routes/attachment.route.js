const express = require("express");
const attachmentController = require("../controllers/attachment.controller");

const router = express.Router();

router.post("/tasks/:taskId/attachments", attachmentController.AttachFileToTask);
router.get("/tasks/:taskId/attachments", attachmentController.GetTaskAttachments);
router.delete("/tasks/:taskId/attachments/:fileId", attachmentController.RemoveFileFromTask);

module.exports = router;