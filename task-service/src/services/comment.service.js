const taskCommentRepository = require("../repositories/comment.repository");
const { request } = require("../rabbitmq/rpcClient");

const AddComment = async (id, taskId, data) => {
    const { content, mentions } = data;

    if(!userId){
        throw new Error("userId must not br null");
    }

    if(!taskId){
        throw new Error("taskId must not br null");
    }

    const comment = await taskCommentRepository.create({ userId: id, taskId, content, });

    if(!comment){
        throw new Error("Error while creating comment");
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
        await commentRepository.createMentions(
            comment.id,
            mentions
        );
    }

    return comment;
};

const UpdateComment = async (commentId, data) => {
    if(!commentId){
        throw new Error("CommentId must not be null");
    }

    const { content } = data;

    return await taskCommentRepository.update(commentId, { content, });
};

const DeleteComment = async (commentId) => {
    if(!commentId){
        throw new Error("CommentId must not be null");
    }

    return await taskCommentRepository.remove(commentId);
};

const GetComment = async (commentId) => {
    if(!commentId){
        throw new Error("commentId must not be null");
    }

    return await taskCommentRepository.findById(commentId);
};

const GetAllComment = async (taskId) => {
    if(!taskId){
        throw new Error("taskId must not be null");
    }

    return await taskCommentRepository.findByTaskId(taskId);
};

const GetMentionsByUser = async (userId) => {
    return await commentRepository.findMentionsByUser(userId);
};

module.exports = {
    AddComment,
    UpdateComment,
    DeleteComment,
    GetComment,
    GetAllComment,
    GetMentionsByUser,
}