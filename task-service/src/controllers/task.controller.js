const taskService = require("../services/task.service");

const CreateTask = async (req, res, next) => {
    try {
        const result = await taskService.CreateTask(req.user.id, req.params.projectId, req.body);

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetTasksByProject = async (req, res, next) => {
    try {
        const result = await taskService.GetTasksByProject(req.user.id, req.params.projectId);

        return res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetTaskDetail = async (req, res, next) => {
    try {
        const result = await taskService.GetTaskDetail(req.params.taskId);

        return res.status(200).json({
            success: true,
            message: "Task's infomation retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const UpdateTask = async (req, res, next) => {
    try {
        const result = await taskService.UpdateTask(req.params.taskId, req.body);

        return res.status(200).json({
            success: true,
            message: "Task's infomation updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const DeleteTask = async (req, res, next) => {
    try {
        const result = await taskService.DeleteTask(req,params.taskId);

        return res.status(204).json({
            success: true,
            message: "Task delete successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const AssignTask = async (req, res, next) => {
    try {
        const result = await taskService.AssignTask(req.params.taskId, req.body.assingeeId);

        return res.status(200).json({
            success: true,
            message: "Task assigned successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const SearchTask = async (req, res, next) => {
    try {
        const result = await taskService.SearchTasks(req.params.projectId, req.query);

        return res.status(200).json({
            success: true,
            message: "Task's infomation retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetTaskByAssignee = async (req, res, next) => {
    try {
        const result = await taskService.GetTaskByAssignee(req.params.projectId, req.body.assigneeId);

        return res.status(200).json({
            success: true,
            message: "Task's infomation retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetMyTasks = async (req, res, next) => {
    try {
        const result = await taskService.GetMyTasks(req.user.id, req.query);

        return res.status(200).json({
            success: true,
            message: "Task's infomation retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetOverdueTasks = async (req, res, next) => {
    try {
        const result = await taskService.GetOverdueTasks(req.params.projectId);

        return res.status(200).json({
            success: true,
            message: "Task's infomation retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetTasksStatistics = async (req, res, next) => {
    try {
        const result = await taskService.GetTasksStatistics(req.params.projectId);

        return res.status(200).json({
            success: true,
            message: "Task's infomation retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    CreateTask,
    GetTasksByProject,
    GetTaskDetail,
    UpdateTask,
    DeleteTask,
    AssignTask,
    SearchTask,
    GetTaskByAssignee,
    GetMyTasks,
    GetOverdueTasks,
    GetTasksStatistics,
}