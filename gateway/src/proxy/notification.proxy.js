const createProxy = require("./create.proxy");

module.exports = createProxy(process.env.NOTIFICATION_SERVICE_URL);