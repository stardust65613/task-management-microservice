const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = createProxyMiddleware({
    target: process.env.TASK_SERVICE_URL,
    changeOrigin: true,
    xfwd: true,

    pathRewrite: (path, req) => {
        console.log("baseUrl:", req.baseUrl);
        console.log("originalUrl:", req.originalUrl);

        return req.originalUrl;
    }
});