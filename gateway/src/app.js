const express = require("express");
const routes = require("./routes");
const { globalRateLimit } = require("./middleware/rate-limit.middleware");
const loggerMiddleware = require("./middleware/logging.middleware");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Gateway không parse json
//app.use(express.json());

app.use(loggerMiddleware);

app.use(globalRateLimit);

app.use("/", routes);

// Không tìm thấy route
app.use(notFound);

// Xử lý lỗi
app.use(errorHandler);

module.exports = app;