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
        include: {
            mentions: true,
        },
    });
}

async function findByTaskId(taskId) {
    return prisma.comment.findMany({
        where: {
            taskId,
        },
        include: {
            mentions: true,
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

async function createMentions(commentId, userIds) {
    return prisma.commentMention.createMany({
        data: userIds.map(userId => ({
            commentId,
            userId,
        })),
        skipDuplicates: true,
    });
}

async function deleteMentions(commentId) {
    return prisma.commentMention.deleteMany({
        where: {
            commentId,
        },
    });
}

async function findMentionsByUser(userId) {
    return prisma.commentMention.findMany({
        where: {
            userId,
        },
        include: {
            comment: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

module.exports = {
    create,
    findById,
    findByTaskId,
    update,
    remove,
    createMentions,
    deleteMentions,
    findMentionsByUser,
};