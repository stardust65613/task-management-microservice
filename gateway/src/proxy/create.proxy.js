const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (target, prefix = "") =>
    createProxyMiddleware({
        target,
        changeOrigin: true,
        xfwd: true,

        pathRewrite: (path) => {
            return prefix + path;
        },
    });