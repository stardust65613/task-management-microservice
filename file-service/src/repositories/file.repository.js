const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.file.create({
        data,
    });
}

async function findById(id) {
    return prisma.file.findUnique({
        where: {
            id,
        },
    });
}

async function findByObjectName(objectName) {
    return prisma.file.findUnique({
        where: {
            objectName,
        },
    });
}

async function findAll() {
    return prisma.file.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function update(id, data) {
    return prisma.file.update({
        where: {
            id,
        },
        data,
    });
}

async function remove(id) {
    return prisma.file.delete({
        where: {
            id,
        },
    });
}

async function findManyByIds(ids) {

    return prisma.file.findMany({
        where:{
            id:{
                in: ids
            }
        }
    });

}

module.exports = {
    create,
    findById,
    findByObjectName,
    findAll,
    update,
    remove,
    findManyByIds,
};