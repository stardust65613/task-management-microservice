const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.project.create({
        data,
    });
}

const createProject = async (data) => {
    return await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
            data: {
                name: data.name,
                description: data.description,
                ownerId: data.ownerId,
                visibility: data.visibility,
            },
        });

        await tx.projectMember.create({
            data: {
                projectId: project.id,
                userId: data.ownerId,
                role: "OWNER",
            },
        });

        await tx.projectSetting.create({
            data: {
                projectId: project.id,
            },
        });

        return project;
    });
};

async function findById(id) {
    return prisma.project.findUnique({
        where: {
            id,
        },
        include: {
            settings: true,
            members: true,
        },
    });
}

async function findByOwnerId(ownerId) {
    return prisma.project.findMany({
        where: {
            ownerId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function findAll() {
    return prisma.project.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function update(id, data) {
    return prisma.project.update({
        where: {
            id,
        },
        data,
    });
}

async function remove(id) {
    return prisma.project.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    findById,
    findByOwnerId,
    findAll,
    update,
    remove,
    createProject,
};