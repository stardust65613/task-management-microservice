const attachmentRepository = require("../repositories/task-attachment.repository");
const { request } = require("../rabbitmq/rpcClient");
const { publish } = require("../rabbitmq/publisher");

const AttachFileToTask = async (taskId, fileId) => {
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

    return await attachmentRepository.create({taskId, fileId: file.id, uploadBy: file.uploadBy, taskId, });
};

const RemoveFileFromTask = async (attachmentId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    if(!fileId){
        throw new Error("fileId must not be null");
    }

    const attachment = attachmentRepository.findById(attachmentId);

    if(!attachment){
        throw new Error("attachment not found");
    }

    const fileId = attachment.fileId;

    await publish(
        "task.events",
        "task.attachment.removed",
        {
            fileId,
        }
    );

    return await attachmentRepository.remove(attachmentId);
};


const GetTaskAttachments = async (taskId) => {
    return await attachmentRepository.findByTaskId(taskId);
};

module.exports = {
    AttachFileToTask,
    RemoveFileFromTask,
    GetTaskAttachments,
}

