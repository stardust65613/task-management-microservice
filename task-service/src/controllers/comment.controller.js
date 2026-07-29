const commentService = require("../services/comment.service");

const AddComment = async (req, res, next) => {
    try {
        const result = await commentService.AddComment(req.user.id, req.params.taskId, req.body);

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const DeleteComment = async (req, res, next) => {
    try {
        const result = await commentService.DeleteComment(req.params.commentId);

        return res.status(201).json({
            success: true,
            message: "Comment deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const UpdateComment = async (req, res, next) => {
    try {
        const result = await commentService.UpdateComment(req.params.commentId, req.body);

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetComment = async (req, res, next) => {
    try {
        const result = await commentService.GetComment(req.params.commentId);

        return res.status(200).json({
            success: true,
            message: "Comment retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetCommentsByTask = async (req, res, next) => {
    try {
        const result = await commentService.GetAllComment(req.params.taskId);

        return res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetMentionsByUser = async (req, res, next) => {
    try {
        const result = await commentService.GetMentionsByUser(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Mentions retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    AddComment,
    UpdateComment,
    DeleteComment,
    GetComment,
    GetCommentsByTask,
    GetMentionsByUser,
}