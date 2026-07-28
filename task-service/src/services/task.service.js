const { task } = require("../lib/prisma");
const taskRepository = require("../repositories/task.repository");
const { TaskPriority, TaskStatus } = require("@prisma/client");

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

const GetTasksByProject = async (id, projectId) => {
    if(!id){
        throw new Error("UserId must not be null");
    }

    if(!projectId){
        throw new Error("projectId must not be null");
    }

    return await taskRepository.findByProjectId(projectId);
};

const GetTaskDetail = async (taskId) => {
    if(!id){
        throw new Error("UserId must not be null");
    }

    if(!taskId){
        throw new Error("taskId must not be null");
    }

    return await taskRepository.findById(taskId);
};

const UpdateTask = async (taskId, data) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    const { title, description, status, priority, dueDate } = data;

    if(!title){
        throw new Error("Title must not br null");
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

    const updateData = {};

    if (title !== undefined) {
        updateData.title = title;
    }

    if (description !== undefined) {
        updateData.description = description;
    }

    if (status !== undefined) {
        updateData.status = status;
    }

    if (priority !== undefined) {
        updateData.priority = priority;
    }

    if (dueDate !== undefined) {
        updateData.dueDate = dueDate;
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error("No fields to update");
    }
    return await taskRepository.update(taskId, updateData);
};

const DeleteTask = async (taskId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    return await taskRepository.remove(taskId);
};

const AssignTask = async (taskId, assigneeId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    if(!assigneeId){
        throw new Error("assigneeId must not be null");
    }

    return await taskRepository.update(taskId, { assigneeId });
};

const SearchTasks = async (projectId, filters) => {
    const {
        keyword,
        status,
        priority,
        assigneeId
    } = filters;

    return await taskRepository.search(projectId, {
        keyword,
        status,
        priority,
        assigneeId
    });
};

const GetTasksByAssignee = async (projectId, assigneeId) => {
    if(!projectId){
        throw new Error("assigneeId must not be null");
    }

    if(!assigneeId){
        throw new Error("assigneeId must not be null");
    }

    return await taskRepository.findByProjectAndAssignee(projectId, assigneeId);
};

const GetMyTasks = async (assigneeId, filters) => {
    if(!assigneeId){
        throw new Error("assigneeId must not be null");
    }

    return await taskRepository.getMyTasks(assigneeId, filters);
};

const GetOverdueTasks = async (projectId) => {
    if(!projectId){
        throw new Error("assigneeId must not be null");
    }

    return await taskRepository.getOverdueTasks(projectId);
};

const GetTasksStatistics = async (projectId) => {
    if(!projectId){
        throw new Error("assigneeId must not be null");
    }

    return await taskRepository.getTaskStatistics(projectId);
};

module.exports = {
    CreateTask,
    GetTasksByProject,
    GetTaskDetail,
    UpdateTask,
    DeleteTask,
    AssignTask,
    SearchTasks,
}