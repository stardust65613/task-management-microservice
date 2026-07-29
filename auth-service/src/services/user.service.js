const userRepository = require("../repositories/user.repository");
const { publish } = require("../rabbitmq/publisher");
const { request } = require("../rabbitmq/rpcClient");

const GetUserInformation = async (id) => {
    const info = await userRepository.findById(id);

    const { username, avatar } = info;

    public_info = {
        username,
        avatar
    }

    return public_info;
}

const GetMyInformation = async (id) => {
    return await userRepository.findById(id);
}

const EditInfomation = async (id, data) => {
    const { username, firstName, lastName } = data;

    if (!username){
        throw new Error("Username must not be null.")
    }

    try {
        return await userRepository.updateUser(id, { username, firstName, lastName ,});
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error("User not found");
        }
        throw error;
    }
}

const CheckUserExists = async (id) => {
    const user = await userRepository.findById(id);

    return {
        exists: !!user,
    };
};

async function getUsersByIds(userIds) {
    const users = await userRepository.findByIds(userIds);

    return {
        success: true,
        data: users,
    };
};

const UpdateAvatar = async (userId, fileId) => {
    // 1. kiểm tra file tồn tại
    const result = await request("file.rpc", {
        action: "CHECK_FILE_EXISTS",
        data: { fileId },
    });

    if (!result) {
        throw new Error("File not found");
    }

    // 2. lấy user
    const user = await userRepository.findById(userId);

    const oldAvatar = user.avatarFileId;

    // 3. cập nhật avatar
    await userRepository.updateAvatar(userId, fileId);

    // 4. publish event
    await publish(
        "user.events",
        "user.deleted", 
        {
            avatarId: oldAvatar,
        }
    );
};

const DeleteUser = async (userId) => {
    if(!userId){
        throw new Error("userId must not be null");
    }

    return await userRepository.deleteUser(userId);
};

module.exports = {
    GetMyInformation,
    GetUserInformation,
    EditInfomation,
    CheckUserExists,
    getUsersByIds,
    UpdateAvatar,
    DeleteUser,
}