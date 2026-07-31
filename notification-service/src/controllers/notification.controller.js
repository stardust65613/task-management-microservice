const notificationService = require("../services/notification.service");

const GetNotifications = async (req, res, next) => {
    try {
        const result = await notificationService.GetNotifications(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Notifications retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetNotification = async (req, res, next) => {
    try {
        const result = await notificationService.GetNotification(req.params.notifyId);

        return res.status(200).json({
            success: true,
            message: "notification retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const MarkAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.MarkAsRead(req.params.notifyId);

        return res.status(200).json({
            success: true,
            message: "notification updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};


const MarkAllAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.MarkAllAsRead(req.user.id);

        return res.status(200).json({
            success: true,
            message: "notifications updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};


const DeleteNotification = async (req, res, next) => {
    try {
        const result = await notificationService.DeleteNotification(req.params.notifyId);

        return res.status(204).json({
            success: true,
            message: "notification deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    GetNotifications,
    GetNotification,
    MarkAsRead,
    MarkAllAsRead,
    DeleteNotification,
};