const rateLimit = require("express-rate-limit");

/**
 * Rate limit mặc định
 * 100 request / 15 phút / IP
 */
const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100,

    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

/**
 * Rate limit riêng cho login
 * Chống brute force
 */
const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes.",
    },
});

/**
 * Rate limit cho refresh token
 */
const refreshRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many refresh requests.",
    },
});

module.exports = {
    globalRateLimit,
    authRateLimit,
    refreshRateLimit,
};