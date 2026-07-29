const projectRepository = require("../repositories/project.repository");
const projectSettingRepository = require("../repositories/project-setting.repository");
const projectMemberRepository = require("../repositories/project-member.repository");
const { ProjectMemberRole, ProjectStatus } = require("@prisma/client");
const { publish } = require("../rabbitmq/publisher");

const CreateProject = async (id, data) => {
    const {name, description, visibility} = data;

    if (!name){
        throw new Error("Project's name must not be null.");
    }

    const validVisibility = ["PRIVATE", "PUBLIC"];

    if (
        visibility &&
        !validVisibility.includes(visibility)
    ) {
        throw new Error("Invalid visibility");
    }

    try {
        return await projectRepository.createProject({
            name,
            description,
            ownerId: id,
            visibility,
        });
    } catch (error) {
        throw error;
    }
};

const UpdateProject = async (id, projectId, data) => {
    const {name, description, visibility, status} = data;

    if (!name){
        throw new Error("Project's name must not be null.");
    }

    if (!projectId) {
        throw new Error("Invalid project Id");
    }

    const validVisibility = ["PRIVATE", "PUBLIC"];

    if (
        visibility &&
        !validVisibility.includes(visibility)
    ) {
        throw new Error("Invalid visibility");
    }

    if (
        status !== undefined &&
        status !== null &&
        !Object.values(ProjectStatus).includes(status)
    ) {
        throw new Error("Invalid project status");
    }

    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.status === ProjectStatus.COMPLETED || project.status === ProjectStatus.ARCHIVED){
        throw new Error("Project has been completed");
    }

    return await projectRepository.update(projectId, {name, description, visibility,});
};

const GetProjectsByUser = async (id) => {
    const project = await projectRepository.GetAllProjectsJoined(id);

    return project;
};

const GetProject = async (id, projectId) => {
    if (!projectId) {
        throw new Error("Invalid project Id");
    }

    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    const member = await projectMemberRepository.find(projectId, id);

    if(!member){
        throw new Error("You are not a member in this project.");
    }

    return project;
};

const DeleteProject = async (id, projectId) => {
    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.ownerId != id){
        throw new Error("You are not the owner of this project");
    }

    await publish(
        "project.events",
        "project.project.removed",
        {
            projectId,
        }
    );

    return await projectRepository.remove(projectId);
};

const DeleteProjectsByOwner = async (ownerId) => {
    const projects = await projectRepository.findByOwner(ownerId);

    for (const project of projects) {
        await DeleteProject(project.id);
    }
};

module.exports = {
    CreateProject,
    UpdateProject,
    GetProjectsByUser,
    GetProject,
    DeleteProject,
    DeleteProjectsByOwner,
}