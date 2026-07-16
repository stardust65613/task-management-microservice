const createProxy = require("./create.proxy");

module.exports = createProxy(
    process.env.AUTH_SERVICE_URL,
    "/users"
);