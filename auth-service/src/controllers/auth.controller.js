const authService = require("../services/auth.service");

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            message: "Register successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const RefreshToken = async (req, res, next) => {
    try {
        const result = await authService.RefreshAccessToken(req.body.refreshToken);

        return res.status(200).json({
            success: true,
            message: "Refresh token successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);

        res.json({
            message: "Logout successfully",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    RefreshToken,
    logout
}