/*const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};

module.exports = notFound;*/

module.exports = (req, res) => {
    console.log("Gateway Not Found:", req.originalUrl);

    res.status(404).json({
        success: false,
        message: "Gateway Not Found",
    });
};