const projectMemberRepository = require("../repositories/project-member.repository");
const { request } = require("../rabbitmq/rpcClient");

const AddMember = async (id, data) => {
    const { userId, projectId } = data;

    if (!userId){
        throw new Error("Invaid user Id");
    }
    
    // Gọi auth service thông qua queue gửi đến rpc server của auth 
    const result = await request("auth.rpc", {
        data:{
            userId
        }
    });

    if (!result.exists) {
        throw new Error("User does not exist");
    }

    return await projectMemberRepository.create({ userId, projectId, });
}