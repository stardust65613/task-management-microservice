const express = require("express");
const commentController = require("../controllers/comment.controller");

const router = express.Router();

router.post("/tasks/:taskId/comments", commentController.AddComment);
router.get("/tasks/:taskId/comments", commentController.GetCommentsByTask);
router.get("/comments/mentions/me", commentController.GetMentionsByUser);
router.get("/comments/:commentId", commentController.GetComment);
router.patch("/comments/:commentId", commentController.UpdateComment);
router.delete("/comments/:commentId", commentController.DeleteComment);

module.exports = router;