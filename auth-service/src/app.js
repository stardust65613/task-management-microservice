const express = require("express");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

// Routes
app.use("/", require("./routes"));

// Không tìm thấy route
app.use(notFound);

// Xử lý lỗi
app.use(errorHandler);

module.exports = app;