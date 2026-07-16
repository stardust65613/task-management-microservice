const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");

const register = async (data) => {
    const { email, username, password } = data;

    if( !email || !username || !password){
        throw new Error("Missing required fields");
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 9);

    const user = await userRepository.createUser({
        email,
        username,
        password: hashedPassword,
    });

    return user; 
}

const login = async (data) => {
    const { email, password } = data;

    if( !email || !password){
        throw new Error("Missing required fields");
    }

    const user = await userRepository.findByEmail(email);

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            roles: user.roles,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m",
        }
    );

    const refreshToken = jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        },
    };
}

const RefreshAccessToken = async (refreshToken) => {

    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    const user = await userRepository.findById(payload.id);

    if (!user) {
        throw new Error("User not found");
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            roles: user.roles,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m",
        }
    );

    return {
        accessToken,
    };
};

const logout = async () => {
    return;
};

module.exports = {
    register,
    login,
    RefreshAccessToken,
    logout
};