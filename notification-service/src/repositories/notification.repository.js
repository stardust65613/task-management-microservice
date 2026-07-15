const prisma = require("../lib/prisma");

async function create(data) {
    return prisma.notification.create({
        data,
    });
}

async function findById(id) {
    return prisma.notification.findUnique({
        where: {
            id,
        },
    });
}

async function findByUserId(userId) {
    return prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function findUnreadByUserId(userId) {
    return prisma.notification.findMany({
        where: {
            userId,
            isRead: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function markAsRead(id) {
    return prisma.notification.update({
        where: {
            id,
        },
        data: {
            isRead: true,
        },
    });
}

async function markAllAsRead(userId) {
    return prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
}

async function update(id, data) {
    return prisma.notification.update({
        where: {
            id,
        },
        data,
    });
}

async function remove(id) {
    return prisma.notification.delete({
        where: {
            id,
        },
    });
}

async function removeByUserId(userId) {
    return prisma.notification.deleteMany({
        where: {
            userId,
        },
    });
}

module.exports = {
    create,
    findById,
    findByUserId,
    findUnreadByUserId,
    markAsRead,
    markAllAsRead,
    update,
    remove,
    removeByUserId,
};