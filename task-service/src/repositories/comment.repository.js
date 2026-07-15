const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.comment.create({
        data,
    });
}

async function findById(id) {
    return prisma.comment.findUnique({
        where: {
            id,
        },
    });
}

async function findByTaskId(taskId) {
    return prisma.comment.findMany({
        where: {
            taskId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

async function update(id, data) {
    return prisma.comment.update({
        where: {
            id,
        },
        data,
    });
}

async function remove(id) {
    return prisma.comment.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    findById,
    findByTaskId,
    update,
    remove,
};