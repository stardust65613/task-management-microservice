const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.task.create({
        data,
    });
}

async function findById(id) {
    return prisma.task.findUnique({
        where: {
            id,
        },
        include: {
            comments: true,
            attachments: true,
        },
    });
}

async function findByProjectId(projectId) {
    return prisma.task.findMany({
        where: {
            projectId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function findByAssigneeId(assigneeId) {
    return prisma.task.findMany({
        where: {
            assigneeId,
        },
        orderBy: {
            dueDate: "asc",
        },
    });
}

async function findByStatus(status) {
    return prisma.task.findMany({
        where: {
            status,
        },
    });
}

async function update(id, data) {
    return prisma.task.update({
        where: {
            id,
        },
        data,
    });
}

async function remove(id) {
    return prisma.task.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    findById,
    findByProjectId,
    findByAssigneeId,
    findByStatus,
    update,
    remove,
};