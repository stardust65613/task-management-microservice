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

    return await userRepository.updateUser(id, {username, firstname, lastname,});
}

module.exports = {
    GetMyInformation,
    GetUserInformation,
    EditInfomation
}