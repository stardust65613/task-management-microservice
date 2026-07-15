const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.projectSetting.create({
        data,
    });
}

async function findByProjectId(projectId) {
    return prisma.projectSetting.findUnique({
        where: {
            projectId,
        },
    });
}

async function update(projectId, data) {
    return prisma.projectSetting.update({
        where: {
            projectId,
        },
        data,
    });
}

async function remove(projectId) {
    return prisma.projectSetting.delete({
        where: {
            projectId,
        },
    });
}

module.exports = {
    create,
    findByProjectId,
    update,
    remove,
};