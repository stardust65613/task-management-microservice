const { consume } = require("./consumer");

const notificationHandler = require("./handlers/notification.handler");
const emailHandler = require("./handlers/email.handler");

const startConsumer = async () => {
    await consume(
        "notification.events",
        "notification.task.assigned.queue",
        "task.assigned",
        notificationHandler.handleTaskAssigned
    );

    await consume(
        "notification.events",
        "notification.task.completed.queue",
        "task.completed",
        notificationHandler.handleTaskCompleted
    );

    await consume(
        "notification.events",
        "notification.project.invited.queue",
        "project.invited",
        notificationHandler.handleProjectInvited
    );

    await consume(
        "notification.events",
        "email.task.assigned.queue",
        "task.assigned",
        emailHandler.handleTaskAssignedEmail
    );

    await consume(
        "notification.events",
        "email.task.completed.queue",
        "task.completed",
        emailHandler.handleTaskCompletedEmail
    );

    await consume(
        "notification.events",
        "email.project.invited.queue",
        "project.invited",
        emailHandler.handleProjectInvitedEmail
    );
};

module.exports = startConsumer;