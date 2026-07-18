const projectRepository = require("../repositories/project.repository");
const projectMemberRepository = require("../repositories/project-member.repository");
const projectSettingRepository = require("../repositories/project-setting.repository");
const { request } = require("../rabbitmq/rpcClient");
const { ProjectMemberRole, ProjectStatus } = require("@prisma/client");

const AddMember = async (id, data) => {
    const { userId, projectId } = data;

    if (!userId){
        throw new Error("Invaid user Id");
    }

    if (!projectId) {
        throw new Error("Invalid project Id");
    }

    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.status === ProjectStatus.COMPLETED || project.status === ProjectStatus.ARCHIVED){
        throw new Error("Project has been completed");
    }

    const requestMember = await projectMemberRepository.find(projectId, id);
    const projectSetting = await projectSettingRepository.findByProjectId(projectId);

    if (requestMember.role === ProjectMemberRole.VIEWER){
        throw new Error("Viewers are not allowed to perform this action");
    }

    if (requestMember.role === ProjectMemberRole.MEMBER && !projectSetting.allowMemberInvite){
        throw new Error("Members are not allowed to perform this action. If you want members could invite please change in project's settings.");
    }
    
    // Gọi auth service thông qua queue gửi đến rpc server của auth 
    const result = await request("auth.rpc", {
        action = "CHECK_USER",
        data:{
            userId
        }
    });

    if (!result.exists) {
        throw new Error("User does not exist");
    }

    return await projectMemberRepository.create({ userId, projectId, });
}

const RemoveMember = async (id, data) => {
    const { userId, projectId } = data;

    if (!userId){
        throw new Error("Invaid user Id");
    }

    if (!projectId) {
        throw new Error("Invalid project Id");
    }

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
    
    const projectMember = await projectMemberRepository.find(projectId, userId);

    if (!projectMember) {
        throw new Error("Project member not found");
    }

    return await projectMemberRepository.remove(projectMember.id);
}

const UpdateMemberRole = async (id, data) => {
    const { userId, projectId, role } = data;

    if (!userId){
        throw new Error("Invaid user Id");
    }

    if (!projectId) {
        throw new Error("Invalid project Id");
    }

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
    
    const projectMember = await projectMemberRepository.find(projectId, userId);

    if (!projectMember) {
        throw new Error("Project member not found");
    }

    if (!Object.values(ProjectMemberRole).includes(role)) {
        throw new Error("Invalid role");
    }

    return await projectMemberRepository.updateRole(projectMember.id, role);
}

const GetMembersOfProject = async (id, data) => {
    const { projectId } = data;

    if (!projectId) {
        throw new Error("Invalid project Id");
    }

    const requestMember = await projectMemberRepository.find(projectId, id);

    if (requestMember.role === ProjectMemberRole.VIEWER){
        throw new Error("Viewers are not allowed to perform this action");
    }

    const members = await projectMemberRepository.findByProjectId(projectId);

    const userIds = members.map(member => member.userId);

    const response = await request("auth.rpc", {
        action: "GET_USERS_BY_IDS",
        data: {
            userIds,
        },
    });

    const users = response.data;

    const userMap = new Map(
        users.map(user => [user.id, user])
    );

    const result = members.map(member => ({
        ...member,
        user: userMap.get(member.userId) || null,
    }));

    return result;
}

const GetCollabProject = async (id, data) => {
    const { userId } = data;

    if (!userId){
        throw new Error("Invaid user Id");
    }

    return await projectMemberRepository.GetCollabProject(id, userId);
}

module.exports = {
    AddMember,
    RemoveMember,
    UpdateMemberRole,
    GetMembersOfProject,
    GetCollabProject,
}