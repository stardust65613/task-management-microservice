const userService = require("../services/user.service");

const GetMyInfo = async (req, res, next) => {
    try {
        const result = await userService.GetMyInformation(req.user.id)

        return res.status(200).json({
            success: true,
            message: "Get my info successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetUserInfo = async (req, res, next) => {
    try {
        const result = await userService.GetMyInformation(req.params.id)

        return res.status(200).json({
            success: true,
            message: "Get user's info successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

const EditInformation = async (req, res, next) => {
    try {
        const result = await userService.EditInfomation(req.user.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Edit user's info successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    GetMyInfo,
    GetUserInfo,
    EditInformation
}