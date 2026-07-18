const projectSettingRepository = require("../repositories/project-setting.repository");
const projectMemberRepository = require("../repositories/project-member.repository");
const projectRepository = require("../repositories/project.repository");

const UpdateProjectSetting = async (id, projectId, data) => {
    const { allowMemberInvite, allowFileUpload } = data;
    
    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.status === ProjectStatus.COMPLETED || project.status === ProjectStatus.ARCHIVED){
        throw new Error("Project has been completed");
    }    

    const requestMember = await projectMemberRepository.find(projectId, id);

    if (requestMember.role === ProjectMemberRole.VIEWER){
        throw new Error("Viewers are not allowed to perform this action");
    }

    if (requestMember.role === ProjectMemberRole.MEMBER){
        throw new Error("Members are not allowed to perform this action");
    }

    if (
        typeof allowMemberInvite !== "boolean" ||
        typeof allowFileUpload !== "boolean"
    ) {
        throw new Error("Invalid permission settings");
    }

    if (!projectId) {
        throw new Error("Invalid project Id");
    }

    return await projectSettingRepository.update(projectId, {allowMemberInvite, allowFileUpload,});
};

const GetProjectSetting = async (id, projectId) => {
    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.status === ProjectStatus.COMPLETED || project.status === ProjectStatus.ARCHIVED){
        throw new Error("Project has been completed");
    }    

    const requestMember = await projectMemberRepository.find(projectId, id);

    if (requestMember.role === ProjectMemberRole.VIEWER){
        throw new Error("Viewers are not allowed to perform this action");
    }

    if (requestMember.role === ProjectMemberRole.MEMBER){
        throw new Error("Members are not allowed to perform this action");
    }

    if (!projectId) {
        throw new Error("Invalid project Id");
    }

    return await projectSettingRepository.findByProjectId(projectId);
};

module.exports = {
    UpdateProjectSetting,
    GetProjectSetting,
}