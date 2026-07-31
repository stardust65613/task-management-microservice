const FILE_EXCHANGE = "file.events";


const FileEvent = {
    UPLOADED: {
        exchange: FILE_EXCHANGE,
        routingKey: "file.uploaded",
    },

    UPDATED: {
        exchange: FILE_EXCHANGE,
        routingKey: "file.updated",
    },

    DELETED: {
        exchange: FILE_EXCHANGE,
        routingKey: "file.deleted",
    },
};


module.exports = FileEvent;