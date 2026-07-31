const notificationRepository = require("../repositories/notification.repository");

const CreateNotification = async (data) => {
    return await notificationRepository.create(data);
};

const GetNotifications = async (userId) => {
    return notificationRepository.findByUserId(userId);
};

const GetNotification = async (id) => {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
        throw new Error("Notification not found");
    }

    return notification;
};

const MarkAsRead = async (id) => {
    await GetNotification(id);

    return notificationRepository.update(id, {
        isRead: true,
    });
};

const MarkAllAsRead = (userId) => {
    return notificationRepository.updateMany(userId, {
        isRead: true,
    });
};

const DeleteNotification = async (id) => {
    await GetNotification(id);

    return notificationRepository.remove(id);
};

module.exports = {
    CreateNotification,
    GetNotifications,
    GetNotification,
    MarkAsRead,
    MarkAllAsRead,
    DeleteNotification,
};