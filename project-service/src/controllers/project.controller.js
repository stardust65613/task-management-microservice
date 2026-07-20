const projectService = require("../services/project.service");

const CreateProject = async (req, res, next) => {
    try {
        const result = await projectService.CreateProject(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const UpdateProject = async (req, res, next) => {
    try {
        const result = await projectService.UpdateProject(req.user.id, req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetUserProject = async (req, res, next) => {
    try {
        const result = await projectService.GetProjectsByUser(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Listed projects sucessfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetProjectDetail = async (req, res, next) => {
    try {
        const result = await projectService.GetProject(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Get project's details successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const DeleteProject = async (req, res, next) => {
    try {
        const result = await projectService.DeleteProject(req.user.id, req.params.id);
        return res.status(204).json({
            success: true,
            message: "Deleted project successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    CreateProject,
    UpdateProject,
    GetUserProject,
    GetProjectDetail,
    DeleteProject,
}