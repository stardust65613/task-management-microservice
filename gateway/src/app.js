const express = require("express");
const routes = require("./routes");
const { globalRateLimit } = require("./middleware/rate-limit.middleware");
const loggerMiddleware = require("./middleware/logging.middleware");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");
const cors = require("cors");

const app = express();

// Gateway không parse json
//app.use(express.json());


app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
}));

app.use(loggerMiddleware);

app.use(globalRateLimit);

app.use("/", routes);

// Không tìm thấy route
app.use(notFound);

// Xử lý lỗi
app.use(errorHandler);

module.exports = app;