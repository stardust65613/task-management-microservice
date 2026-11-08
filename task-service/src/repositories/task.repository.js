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

const findByProjectId = async (projectId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where: {
                projectId,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.task.count({
            where: {
                projectId,
            },
        }),
    ]);

    return {
        tasks,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

const findAllByProjectId = async (projectId) => {
    return await prisma.task.findMany({
        where: {
            projectId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

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

async function deleteByProjectId(projectId) {
    return prisma.task.deleteMany({
        where: {
            projectId,
        },
    });
}

async function getUserTasksStatistics(projectIds) {
    const result = await prisma.task.groupBy({
        by: ["status"],
        where: {
            projectId: {
                in: projectIds,
            },
        },
        _count: {
            id: true,
        },
    });

    const statistics = {
        totalTasks: 0,
        todoTasks: 0,
        inProgressTasks: 0,
        reviewTasks: 0,
        completedTasks: 0,
        cancelledTasks: 0,
    };

    const statusMap = {
        TODO: "todoTasks",
        IN_PROGRESS: "inProgressTasks",
        REVIEW: "reviewTasks",
        DONE: "completedTasks",
        CANCELLED: "cancelledTasks",
    };

    for (const item of result) {
        const count = item._count.id;

        statistics.totalTasks += count;
        statistics[statusMap[item.status]] = count;
    }

    return statistics;
}

async function getRecentTasks(assigneeId, limit = 5) {
    return prisma.task.findMany({
        where: {
            assigneeId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
    });
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
    deleteByProjectId,
    findAllByProjectId,
    getUserTasksStatistics,
    getRecentTasks,
};