const userRepository = require("../repositories/user.repository");


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
    const { username, firstname, lastname } = data;

    if (!username){
        throw new Error("Username must not be null.")
    }

    try {
        return await userRepository.updateUser(id, { username, firstname, lastname ,});
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
}

module.exports = {
    GetMyInformation,
    GetUserInformation,
    EditInfomation,
    CheckUserExists,
    getUsersByIds
}