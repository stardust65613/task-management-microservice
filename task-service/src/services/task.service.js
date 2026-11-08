const { task } = require("../lib/prisma");
const taskRepository = require("../repositories/task.repository");
const { TaskPriority, TaskStatus } = require("@prisma/client");
const { request } = require("../rabbitmq/rpcClient");
const { publish } = require("../rabbitmq/publisher");

const CreateTask = async (id, projectId, data) => {
    const { title, description, status, priority, dueDate } = data;

    if(!id){
        throw new Error("UserId must not be null");
    }

    if(!title){
        throw new Error("Title must not br null");
    }

    if(!projectId){
        throw new Error("projectId must not be null");
    }

    if(
        status !== undefined &&
        status !== null &&
        !Object.values(TaskStatus).includes(status)
    ){
        throw new Error("Invalid task status");
    }

    if(
        priority !== undefined &&
        priority !== null &&
        !Object.values(TaskPriority).includes(priority)
    ){
        throw new Error("Invalid task priority");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    const task = await taskRepository.create({
        createdBy: id,
        projectId,
        title,
        description,
        status,
        priority,
        dueDate,
    });

    return task;
};

const GetTasksByProject = async (id, projectId, page = 1, limit = 10) => {
    if (!id) {
        throw new Error("UserId must not be null");
    }

    if (!projectId) {
        throw new Error("projectId must not be null");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await taskRepository.findByProjectId(
        projectId,
        page,
        limit
    );
};

const GetAllTasksByProject = async (id, projectId) => {
    if (!id) {
        throw new Error("UserId must not be null");
    }

    if (!projectId) {
        throw new Error("projectId must not be null");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await taskRepository.findAllByProjectId(projectId);
};

const GetTaskDetail = async (id, taskId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    const task = await taskRepository.findById(taskId);

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId : task.projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return task;
};

const UpdateTask = async (id, taskId, data) => {
    if (!taskId) {
        throw new Error("taskId must not be null");
    }

    const task = await taskRepository.findById(taskId);

    if (!task) {
        throw new Error("Task not found");
    }

    // Prevent updating completed or cancelled tasks
    if ([TaskStatus.DONE, TaskStatus.CANCELLED].includes(task.status)) {
        throw new Error("Cannot update a completed or cancelled task");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId: task.projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    const { title, description, status, priority, dueDate } = data;

    const updateData = {};

    // Title
    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            throw new Error("Title must not be empty");
        }

        updateData.title = title.trim();
    }

    // Description
    if (description !== undefined) {
        updateData.description = description;
    }

    // Status
    if (status !== undefined) {
        if (!Object.values(TaskStatus).includes(status)) {
            throw new Error("Invalid task status");
        }

        updateData.status = status;
    }

    // Priority
    if (priority !== undefined) {
        if (!Object.values(TaskPriority).includes(priority)) {
            throw new Error("Invalid task priority");
        }

        updateData.priority = priority;
    }

    // Due date
    if (data.dueDate !== undefined) {
        if (data.dueDate === null || data.dueDate === "") {
            updateData.dueDate = null;
        } else {
            const dueDate = new Date(data.dueDate);

            if (Number.isNaN(dueDate.getTime())) {
                throw new Error("Invalid due date");
            }

            updateData.dueDate = dueDate;
        }
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error("No fields to update");
    }

    return await taskRepository.update(taskId, updateData);
};

const DeleteTask = async (id, taskId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    const task = await taskRepository.findById(taskId);

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId : task.projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await taskRepository.remove(taskId);
};

const AssignTask = async (id, taskId, assigneeId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    if(!assigneeId){
        throw new Error("assigneeId must not be null");
    }

    const oldTask = await taskRepository.findById(taskId);

    if(id != oldTask.createdBy){
        throw new Error("You are not owner of this task");
    }

    const task = await taskRepository.update(taskId, {
        assigneeId,
    });

    const result = await request("auth.rpc", {
        action: "GET_USERS_BY_IDS",
        data: {
            userIds: [assigneeId],
        },
    });

    const assignee = result.users[0];

    const project = await request("project.rpc", {
        action: "GET_PROJECT_INFO",
        data: {
            projectId: task.projectId,
            userId: assigneeId,
        },
    });

    await publish(
        "notification.events",
        "task.assigned",
        {
            userId: assignee.id,
            username: assignee.username,
            email: assignee.email,
            taskId: task.id,
            taskTitle: task.title,
            projectId: project.id,
            projectName: project.name,
        }
    );

    return task;
};

const SearchTasks = async (id, projectId, filters) => {
    const {
        keyword,
        status,
        priority,
        assigneeId
    } = filters;

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await taskRepository.search(projectId, {
        keyword,
        status,
        priority,
        assigneeId
    });
};

const GetTasksByAssignee = async (id, projectId, assigneeId) => {
    if(!projectId){
        throw new Error("assigneeId must not be null");
    }

    if(!assigneeId){
        throw new Error("assigneeId must not be null");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await taskRepository.findByProjectAndAssignee(projectId, assigneeId);
};

const GetMyTasks = async (assigneeId, filters) => {
    if (!assigneeId) {
        throw new Error("assigneeId must not be null");
    }

    const tasks = await taskRepository.getMyTasks(assigneeId, filters);

    const tasksWithProject = await Promise.all(
        tasks.map(async (task) => {
            try {
                const project = await request("project.rpc", {
                    action: "GET_PROJECT_INFO",
                    data: {
                        projectId: task.projectId,
                        userId: assigneeId,
                    },
                });

                return {
                    ...task,
                    project: {
                        id: project.id,
                        name: project.name,
                    },
                };
            } catch (error) {
                console.error(
                    `Failed to get project info for task ${task.id}:`,
                    error
                );

                return {
                    ...task,
                    project: null,
                };
            }
        })
    );

    return tasksWithProject;
};

const GetOverdueTasks = async (id, projectId) => {
    if(!projectId){
        throw new Error("projectId must not be null");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await taskRepository.getOverdueTasks(projectId);
};

const GetTasksStatistics = async (id ,projectId) => {
    if(!projectId){
        throw new Error("assigneeId must not be null");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (result.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    return await taskRepository.getTaskStatistics(projectId);
};

const DeleteTasksByProject = async (projectId) => {
    return await taskRepository.deleteByProjectId(projectId);
};

const CompleteTask = async (id, taskId) => {
    const task = await taskRepository.findById(taskId);

    if (!task) {
        throw new Error("Task not found");
    }

    if (task.status === "DONE") {
        throw new Error("Task is already completed");
    }

    if (task.status === "CANCELLED") {
        throw new Error("Cancelled task cannot be completed");
    }

    // Chỉ assignee hoặc người tạo task mới được complete
    if (id !== task.assigneeId && id !== task.createdBy) {
        throw new Error("You don't have permission to complete this task");
    }

    const updatedTask = await taskRepository.update(taskId, {
        status: "DONE",
    });

    const result = await request("auth.rpc", {
        action: "GET_USERS_BY_IDS",
        data: {
            userIds: [task.assigneeId, task.createdBy],
        },
    });

    const users = result.users;

    const assignee = users.find(user => user.id === task.assigneeId);
    const creator = users.find(user => user.id === task.createdBy);

    if (!assignee || !creator) {
        throw new Error("User not found");
    }

    const project = await request("project.rpc", {
        action: "GET_PROJECT_INFO",
        data: {
            projectId: task.projectId,
            userId: id,
        },
    });

    // Chỉ gửi mail khi assignee hoàn thành task do người khác tạo
    if (id === task.assigneeId && task.assigneeId !== task.createdBy) {
        await publish(
            "notification.events",
            "task.completed",
            {
                userId: creator.id,
                username: creator.username,
                email: creator.email,

                completedBy: assignee.username,

                taskId: updatedTask.id,
                taskTitle: updatedTask.title,

                projectId: project.id,
                projectName: project.name,
            }
        );
    }

    return updatedTask;
};

const GetUserTasksStatistics = async (userId, projectIds) => {
    if (!userId) {
        throw new Error("userId must not be null");
    }

    if (!Array.isArray(projectIds)) {
        throw new Error("projectIds must be an array");
    }

    // Không có project thì không có task thuộc các project đó
    if (projectIds.length === 0) {
        return {
            totalTasks: 0,
            todoTasks: 0,
            inProgressTasks: 0,
            reviewTasks: 0,
            completedTasks: 0,
            cancelledTasks: 0,
        };
    }

    return await taskRepository.getUserTasksStatistics(projectIds);
};

const GetRecentTasks = async (assigneeId, limit = 5) => {
    if (!assigneeId) {
        throw new Error("assigneeId must not be null");
    }

    const tasks = await taskRepository.getRecentTasks(
        assigneeId,
        limit
    );

    const projectCache = new Map();

    return await Promise.all(
        tasks.map(async (task) => {
            let project = projectCache.get(task.projectId);

            if (!project) {
                project = await request("project.rpc", {
                    action: "GET_PROJECT_INFO",
                    data: {
                        projectId: task.projectId,
                        userId: assigneeId,
                    },
                });

                projectCache.set(task.projectId, project);
            }

            return {
                ...task,
                project: {
                    id: project.id,
                    name: project.name,
                },
            };
        })
    );
};

module.exports = {
    CreateTask,
    GetTasksByProject,
    GetTaskDetail,
    UpdateTask,
    DeleteTask,
    AssignTask,
    SearchTasks,
    DeleteTasksByProject,
    GetTasksByAssignee,
    GetMyTasks,
    GetOverdueTasks,
    GetTasksStatistics,
    CompleteTask,
    GetAllTasksByProject,
    GetUserTasksStatistics,
    GetRecentTasks,
}