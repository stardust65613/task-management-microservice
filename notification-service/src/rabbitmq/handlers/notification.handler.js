const notificationService = require("../../services/notification.service");

const handleTaskAssigned = async (data) => {
    await notificationService.CreateNotification({
        userId: data.userId,
        type: "TASK_ASSIGNED",
        title: "Task Assigned",
        message: `You have been assigned task "${data.taskTitle}".`,
    });
};

const handleTaskCompleted = async (data) => {
    await notificationService.CreateNotification({
        userId: data.userId,
        type: "TASK_COMPLETED",
        title: "Task Completed",
        message: `Task "${data.taskTitle}" has been completed.`,
    });
};

const handleProjectInvited = async (data) => {
    await notificationService.CreateNotification({
        userId: data.userId,
        type: "PROJECT_INVITED",
        title: "Project Invitation",
        message: `You have been invited to project "${data.projectName}".`,
    });
};

module.exports = {
    handleTaskAssigned,
    handleTaskCompleted,
    handleProjectInvited,
};