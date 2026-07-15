const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.projectMember.create({
        data,
    });
}

async function find(projectId, userId) {
    return prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId,
            },
        },
    });
}

async function findByProjectId(projectId) {
    return prisma.projectMember.findMany({
        where: {
            projectId,
        },
    });
}

async function findByUserId(userId) {
    return prisma.projectMember.findMany({
        where: {
            userId,
        },
    });
}

async function updateRole(id, role) {
    return prisma.projectMember.update({
        where: {
            id,
        },
        data: {
            role,
        },
    });
}

async function remove(id) {
    return prisma.projectMember.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    find,
    findByProjectId,
    findByUserId,
    updateRole,
    remove,
};