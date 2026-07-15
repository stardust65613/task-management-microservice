const prisma = require("../lib/prisma");

async function findByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

async function createUser(data) {
    return prisma.user.create({
        data,
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
}

async function updateUser(id, data) {
    return prisma.user.update({
        where: {
            id,
        },
        data,
    });
}

async function deleteUser(id) {
    return prisma.user.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    findByEmail,
    createUser,
    findById,
    updateUser,
    deleteUser,
};