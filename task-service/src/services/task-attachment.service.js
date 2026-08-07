const attachmentRepository = require("../repositories/task-attachment.repository");
const taskRepository = require("../repositories/task.repository");
const { request } = require("../rabbitmq/rpcClient");
const { publish } = require("../rabbitmq/publisher");

const AttachFileToTask = async (id, taskId, fileId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    if(!fileId){
        throw new Error("fileId must not be null");
    }

    const result = await request("file.rpc", {
        action: "CHECK_FILE_EXISTS",
        data: {
            fileId
        },
    });

    if(!result){
        throw new Error("file does not exist");
    }

    const file = await request("file.rpc", {
        action: "GET_FILE_INFO",
        data: {
            fileId
        },
    });

    if(!file){
        throw new Error("file does not exist");
    }

    const task = await taskRepository.findById(taskId);

    const res = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId : task.projectId,
            userIds: [id],
        },
    });

    if (res.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await attachmentRepository.create({taskId, fileId: file.id, uploadedBy: file.uploadedBy, taskId, });
};

const RemoveFileFromTask = async (id, taskId, fileId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    if(!fileId){
        throw new Error("fileId must not be null");
    }

    const attachment = attachmentRepository.findByTaskIdAndFileId(taskId, fileId);

    if(!attachment){
        throw new Error("attachment not found");
    }

    await publish(
        "task.events",
        "task.attachment.removed",
        {
            fileId,
        }
    );

    const task = await taskRepository.findById(taskId);

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId : task.projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await attachmentRepository.remove(taskId, fileId);
};


const GetTaskAttachments = async (id, taskId) => {
    const task = await taskRepository.findById(taskId);

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId : task.projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await attachmentRepository.findByTaskId(taskId);
};

module.exports = {
    AttachFileToTask,
    RemoveFileFromTask,
    GetTaskAttachments,
}

