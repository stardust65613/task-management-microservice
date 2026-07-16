const crypto = require("crypto");

function logRequest(entry) {
    process.stdout.write(JSON.stringify(entry) + "\n");
}

module.exports = (req, res, next) => {
    const start = Date.now();

    // Nếu client chưa gửi request id thì tự tạo
    const requestId =
        req.headers["x-request-id"] || crypto.randomUUID();

    // Truyền requestId cho các service phía sau
    req.headers["x-request-id"] = requestId;
    res.setHeader("x-request-id", requestId);

    res.on("finish", () => {
        logRequest({
            timestamp: new Date().toISOString(),

            level: "info",

            service: "gateway",

            requestId,

            method: req.method,

            path: req.originalUrl,

            route: req.route?.path || null,

            status: res.statusCode,

            durationMs: Date.now() - start,

            clientIp: req.ip,

            userId: req.user?.id || null,

            userAgent: req.get("User-Agent") || null,
        });
    });

    next();
};