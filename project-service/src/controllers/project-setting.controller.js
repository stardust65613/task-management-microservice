const projectSettingService = require("../services/project-setting.service");

const UpdateProjectSetting = async (req, res, next) => {
    try {
        const result = await projectSettingService.UpdateProjectSetting(req.user.id, req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Project's setting updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetProjectSetting = async (req, res, next) => {
    try {
        const result = await projectSettingService.GetProjectSetting(req.user.id, req.params.id);

        return res.status(200).json({
            success: true,
            message: "Project's setting retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    UpdateProjectSetting,
    GetProjectSetting,
}