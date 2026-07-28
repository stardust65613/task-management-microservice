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

async function findByProjectAndAssignee(projectId, assigneeId) {
    return prisma.task.findMany({
        where: {
            projectId,
            assigneeId,
        },
        orderBy: {
            createdAt: "desc",
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

async function search (projectId, filters) {
    const { status, priority, assigneeId, keyword } = filters;

    const where = {
        projectId,
    };

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = priority;
    }

    if (assigneeId) {
        where.assigneeId = assigneeId;
    }

    if (keyword) {
        where.OR = [
            {
                title: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
        ];
    }

    return prisma.task.findMany({
        where,
    });
};

async function getMyTasks(assigneeId, filters = {}) {
    const { status, priority, keyword } = filters;

    const where = {
        assigneeId,
    };

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = priority;
    }

    if (keyword) {
        where.OR = [
            {
                title: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
        ];
    }

    return prisma.task.findMany({
        where,
        orderBy: {
            createdAt: "desc",
        },
    });
};

async function getOverdueTasks(projectId) {
    return prisma.task.findMany({
        where: {
            projectId,
            dueDate: {
                lt: new Date(),
            },
            status: {
                notIn: ["DONE", "CANCELLED"],
            },
        },
    });
};

async function getTaskStatistics(projectId) {
    const [total, overdue, statusStats] = await Promise.all([
        prisma.task.count({
            where: {
                projectId,
            },
        }),

        prisma.task.count({
            where: {
                projectId,
                dueDate: {
                    lt: new Date(),
                },
                status: {
                    notIn: ["DONE", "CANCELLED"],
                },
            },
        }),

        prisma.task.groupBy({
            by: ["status"],
            where: {
                projectId,
            },
            _count: {
                status: true,
            },
        }),
    ]);

    const statistics = {
        total,
        overdue,
        todo: 0,
        inProgress: 0,
        review: 0,
        done: 0,
        cancelled: 0,
    };

    statusStats.forEach(({ status, _count }) => {
        switch (status) {
            case "TODO":
                statistics.todo = _count.status;
                break;

            case "IN_PROGRESS":
                statistics.inProgress = _count.status;
                break;

            case "REVIEW":
                statistics.review = _count.status;
                break;

            case "DONE":
                statistics.done = _count.status;
                break;

            case "CANCELLED":
                statistics.cancelled = _count.status;
                break;
        }
    });

    return statistics;
}

module.exports = {
    create,
    findById,
    findByProjectId,
    findByAssigneeId,
    findByStatus,
    update,
    remove,
    search,
    findByProjectAndAssignee,
    getMyTasks,
    getOverdueTasks,
    getTaskStatistics,
};