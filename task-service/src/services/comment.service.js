const taskCommentRepository = require("../repositories/comment.repository");
const taskRepository = require("../repositories/task.repository");
const { request } = require("../rabbitmq/rpcClient");

const AddComment = async (id, taskId, data) => {
    const { content, mentions, projectId } = data;

    if(!taskId){
        throw new Error("taskId must not be null");
    }

    const comment = await taskCommentRepository.create({ userId: id, taskId, content, });

    if(!comment){
        throw new Error("Error while creating comment");
    }

    const res = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: [id],
        },
    });

    if (res.members.length !== 1) {
        throw new Error("User was not a member of this project");
    }

    const result = await request("project.rpc", {
        action: "CHECK_PROJECT_MEMBERS",
        data: {
            projectId,
            userIds: mentions,
        },
    });

    if (result.members.length !== mentions.length) {
        throw new Error("Some mentioned users are not members of this project");
    }

    if (mentions.length > 0) {
        await taskCommentRepository.createMentions(
            comment.id,
            mentions
        );
    }

    return comment;
};

const UpdateComment = async (id, commentId, data) => {
    if(!commentId){
        throw new Error("CommentId must not be null");
    }

    const { content } = data;
    
    const comment = taskCommentRepository.findById(commentId);

    if( id != comment.userId){
        throw new Error("Can not edit other's comment");
    }

    return await taskCommentRepository.update(commentId, { content, });
};

const DeleteComment = async (id, commentId) => {
    if(!commentId){
        throw new Error("CommentId must not be null");
    }

    const comment = taskCommentRepository.findById(commnetId);

    const task = await taskRepository.findById(comment.taskId);
    
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

    return await taskCommentRepository.remove(commentId);
};

const GetComment = async (id, commentId) => {
    if(!commentId){
        throw new Error("commentId must not be null");
    }

    const comment = taskCommentRepository.findById(commnetId);

    const task = await taskRepository.findById(comment.taskId);
    
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

    return await taskCommentRepository.findById(commentId);
};

const GetAllComment = async (id, taskId) => {
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

    return await taskCommentRepository.findByTaskId(taskId);
};

const GetMentionsByUser = async (userId) => {
    return await taskCommentRepository.findMentionsByUser(userId);
};

module.exports = {
    AddComment,
    UpdateComment,
    DeleteComment,
    GetComment,
    GetAllComment,
    GetMentionsByUser,
}