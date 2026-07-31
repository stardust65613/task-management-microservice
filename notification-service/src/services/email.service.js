const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
    });
};

const sendTaskAssignedEmail = async (to, username, taskTitle, projectName) => {
    return sendEmail({
        to,
        subject: "New Task Assigned",
        html: `
            <h2>Hello ${username},</h2>
            <p>You have been assigned a new task.</p>

            <p><strong>Project:</strong> ${projectName}</p>
            <p><strong>Task:</strong> ${taskTitle}</p>

            <p>Please log in to the system to view the task details.</p>

            <br>
            <p>Task Management System</p>
        `,
    });
};

const sendTaskCompletedEmail = async (to, username, taskTitle, projectName) => {
    return sendEmail({
        to,
        subject: "Task Completed",
        html: `
            <h2>Hello ${username},</h2>

            <p>The following task has been marked as completed.</p>

            <p><strong>Project:</strong> ${projectName}</p>
            <p><strong>Task:</strong> ${taskTitle}</p>

            <br>
            <p>Task Management System</p>
        `,
    });
};

const sendProjectInvitationEmail = async (
    to,
    username,
    projectName,
    inviterName
) => {
    return sendEmail({
        to,
        subject: "Project Invitation",
        html: `
            <h2>Hello ${username},</h2>

            <p>You have been invited to join a project.</p>

            <p><strong>Project:</strong> ${projectName}</p>
            <p><strong>Invited by:</strong> ${inviterName}</p>

            <p>Please log in to the system to accept the invitation.</p>

            <br>
            <p>Task Management System</p>
        `,
    });
};

module.exports = {
    sendEmail,
    sendTaskAssignedEmail,
    sendTaskCompletedEmail,
    sendProjectInvitationEmail,
};