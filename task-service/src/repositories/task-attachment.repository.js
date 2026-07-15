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

async function remove(id) {
    return prisma.taskAttachment.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    findById,
    findByTaskId,
    find,
    remove,
};