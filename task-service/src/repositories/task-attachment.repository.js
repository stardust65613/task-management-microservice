const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.taskAttachment.create({
        data,
    });
}

async function findById(id) {
    return prisma.taskAttachment.findUnique({
        where: {
            id,
        },
    });
}

async function findByTaskId(taskId) {
    return prisma.taskAttachment.findMany({
        where: {
            taskId,
        },
    });
}

async function find(taskId, fileId) {
    return prisma.taskAttachment.findUnique({
        where: {
            taskId_fileId: {
                taskId,
                fileId,
            },
        },
    });
}

async function remove(taskId, fileId) {
    return prisma.taskAttachment.delete({
        where: {
            taskId_fileId: {
                taskId,
                fileId
            }
        }
    });
}

async function findByTaskIdAndFileId(taskId, fileId) {
    return prisma.taskAttachment.findFirst({
        where: {
            taskId,
            fileId
        }
    });
}

module.exports = {
    create,
    findById,
    findByTaskId,
    find,
    remove,
    findByTaskIdAndFileId,
};