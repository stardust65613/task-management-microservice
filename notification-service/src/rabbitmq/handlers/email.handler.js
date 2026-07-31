const emailService = require("../../services/email.service");

const handleTaskAssignedEmail = async (data) => {
    await emailService.sendTaskAssignedEmail(
        data.email,
        data.username,
        data.taskTitle,
        data.projectName
    );
};

const handleTaskCompletedEmail = async (data) => {
    await emailService.sendTaskCompletedEmail(
        data.email,
        data.username,
        data.taskTitle,
        data.projectName
    );
};

const handleProjectInvitedEmail = async (data) => {
    await emailService.sendProjectInvitationEmail(
        data.email,
        data.username,
        data.projectName,
        data.inviterName
    );
};

module.exports = {
    handleTaskAssignedEmail,
    handleTaskCompletedEmail,
    handleProjectInvitedEmail,
};