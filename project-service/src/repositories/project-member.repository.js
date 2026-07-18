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

async function RemoveMember(projectId, userId) {
    projectMember = prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId,
            },
        },
    });

    id = projectMember.id;

    return prisma.projectMember.delete({
        where: {
            id,
        },
    });
}

async function GetCollabProject(userId_1, userId_2){
    const projects = await prisma.project.findMany({
        where: {
            members: {
                some: {
                    userId: userId_1,
                },
            },
            AND: {
                members: {
                    some: {
                        userId: userId_2,
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
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
    RemoveMember,
    GetCollabProject
};