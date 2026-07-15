const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.project.create({
        data,
    });
}

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
};