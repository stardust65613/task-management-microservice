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

module.exports = {
    GetMyInformation,
    GetUserInformation
}