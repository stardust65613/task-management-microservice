const createProxy = require("./create.proxy");

module.exports = createProxy(
    process.env.FILE_SERVICE_URL,
    "/files"
);