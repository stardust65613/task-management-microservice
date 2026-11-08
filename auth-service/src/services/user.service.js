const userRepository = require("../repositories/user.repository");
const { publish } = require("../rabbitmq/publisher");
const { request } = require("../rabbitmq/rpcClient");
const bcrypt = require("bcrypt");

const GetUserInformation = async (id) => {
    const info = await userRepository.findById(id);

    const { username, avatar, createdAt, email, isActive } = info;

    public_info = {
        username,
        avatar,
        createdAt,
        email,
        isActive,
    }

    return public_info;
}

const GetUserInfoByEmail = async (s_email) => {
    const info = await userRepository.findByEmail(s_email);

    if (!info) {
        return null;
    }

    const { id, username, avatar, createdAt, email, isActive } = info;

    const public_info = {
        id,
        username,
        avatar,
        createdAt,
        email,
        isActive,
    }

    console.log("Public info:", public_info);

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

    const user = await userRepository.findById(id);

    if (!user) {
        throw new Error("User not found");
    }

    if (username) {
        const existingUser = await userRepository.findByUsername(username);

        if (existingUser && existingUser.id !== id) {
            throw new Error("Username already exists");
        }
    }

    return await userRepository.updateUser(id, { username, firstName, lastName ,});
}

const CheckUserExists = async (id) => {
    const user = await userRepository.findById(id);

    return {
        exists: !!user,
    };
};

const getUsersByIds = async (userIds) => {
    const users = await userRepository.findByIds(userIds);

    return {
        users,
    };
};

const UpdateAvatar = async (userId, fileId) => {
    if (!fileId) {
        throw new Error("fileId must not be null");
    }

    // 1. Kiểm tra file mới tồn tại
    const result = await request("file.rpc", {
        action: "CHECK_FILE_EXISTS",
        data: { fileId },
    });

    if (!result) {
        throw new Error("File not found");
    }

    // 2. Lấy user
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const oldAvatar = user.avatar;

    if (oldAvatar === fileId) {
        return user;
    }

    // 3. Cập nhật avatar mới
    const updatedUser = await userRepository.updateAvatar(userId, fileId);

    // 4. Xóa avatar cũ nếu tồn tại
    if (oldAvatar) {
        await publish(
            "file.events",
            "file.deleted",
            {
                fileId: oldAvatar,
            }
        );
    }

    return updatedUser;
};

const DeleteUser = async (userId) => {
    if(!userId){
        throw new Error("userId must not be null");
    }

    return await userRepository.deleteUser(userId);
};

const ChangePassword = async (id, data) => {
    const { password } = data;

    if (!password){
        throw new Error("Password must not be null.")
    }

    const user = await userRepository.findById(id);

    const hashedPassword = await bcrypt.hash(password, 9);

    if (!user) {
        throw new Error("User not found");
    }

    return await userRepository.updateUser(id, { password: hashedPassword, });
};

const GetUserDashboardStatistics = async (userId) => {
    if (!userId) {
        throw new Error("userId must not be null");
    }

    const { projectIds } = await request("project.rpc", {
        action: "GET_USER_PROJECT_IDS",
        data: {
            userId,
        },
    });

    const [projectStats, taskStats] = await Promise.all([
        request("project.rpc", {
            action: "GET_PROJECT_STATISTICS",
            data: {
                userId,
            },
        }),

        request("task.rpc", {
            action: "GET_USER_TASKS_STATISTICS",
            data: {
                userId,
                projectIds,
            },
        }),
    ]);

    return {
        ...projectStats,
        ...taskStats,
    };
};

module.exports = {
    GetMyInformation,
    GetUserInformation,
    EditInfomation,
    CheckUserExists,
    getUsersByIds,
    UpdateAvatar,
    DeleteUser,
    ChangePassword,
    GetUserInfoByEmail,
    GetUserDashboardStatistics,
}