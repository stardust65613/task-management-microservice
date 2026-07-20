const projectRepository = require("../repositories/project.repository");
const projectSettingRepository = require("../repositories/project-setting.repository");
const projectMemberRepository = require("../repositories/project-member.repository");
const { ProjectMemberRole, ProjectStatus } = require("@prisma/client");

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

    /// Thêm code lấy các task của project rồi map vào project để hiển thị.

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

    /// Thêm code xóa các task trong project

    return await projectRepository.remove(projectId);
};

module.exports = {
    CreateProject,
    UpdateProject,
    GetProjectsByUser,
    GetProject,
    DeleteProject,
}