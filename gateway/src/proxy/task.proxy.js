const createProxy = require("./create.proxy");

module.exports = createProxy(process.env.TASK_SERVICE_URL);