const projectMemberService = require("../services/project-member.service");

const AddMember = async (req, res, next) => {
    try {
        const result = await projectMemberService.AddMember(req.user.id, req.params.id, req.body);

        return res.status(201).json({
            success: true,
            message: "Added member successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const RemoveMember = async (req, res, next) => {
    try {
        const result = await projectMemberService.RemoveMember(req.user.id, req.params.id, req.params.userId);

        return res.status(204).json({
            success: true,
            message: "Removed member successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const UpdateMember = async (req, res, next) => {
    try {
        const result = await projectMemberService.UpdateMemberRole(req.user.id, req.params.id, req.params.userId);

        return res.status(200).json({
            success: true,
            message: "Updated member successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetProjectMember = async (req, res, next) => {
    try {
        const result = await projectMemberService.GetMembersOfProject(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: "Get members of project successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetCollabProject = async (req, res, next) => {
    try {
        const result = await projectMemberService.GetCollabProject(req.user.id, req.params.userId);

        return res.status(200).json({
            success: true,
            message: "Shared projects retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    AddMember,
    RemoveMember,
    UpdateMember,
    GetProjectMember,
    GetCollabProject,
}