const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (target, prefix = "") =>
    createProxyMiddleware({
        target,
        changeOrigin: true,
        xfwd: true,

        pathRewrite: (path, req) => {
            const newPath = prefix + path;

            console.log({
                target,
                originalUrl: req.originalUrl,
                url: req.url,
                path,
                newPath
            });

            return newPath;
        },

        onProxyReq(proxyReq, req) {
            console.log(
                "FORWARD:",
                req.method,
                target + req.url
            );
        }
    });