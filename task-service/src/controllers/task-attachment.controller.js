const attachmentService = require("../services/task-attachment.service");

const AttachFileToTask = async (req, res, next) => {
    try {
        const result = await attachmentService.AttachFileToTask(req.params.taskId, req.body.fileId);

        return res.status(201).json({
            success: true,
            message: "Task attachment created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const RemoveFileFromTask = async (req, res, next) => {
    try {
        const result = await attachmentService.RemoveFileFromTask(req.params.attachmentId);

        return res.status(204).json({
            success: true,
            message: "Task attachment deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetTaskAttachments = async (req, res, next) => {
    try {
        const result = await attachmentService.GetTaskAttachments(req.params.taskId);

        return res.status(200).json({
            success: true,
            message: "Task attachment retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    AttachFileToTask,
    RemoveFileFromTask,
    GetTaskAttachments,
}