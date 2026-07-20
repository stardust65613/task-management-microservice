const createProxy = require("./create.proxy");

module.exports = createProxy(
    process.env.PROJECT_SERVICE_URL,
    "/projects"
);