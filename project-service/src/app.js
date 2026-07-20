const express = require("express");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");
const projectRouter = require("./routes/index");

const app = express();

app.use(express.json());

// Routes
app.use("/projects", projectRouter);

// Không tìm thấy route
app.use(notFound);

// Xử lý lỗi
app.use(errorHandler);

module.exports = app;