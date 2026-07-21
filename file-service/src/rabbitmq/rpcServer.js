const { getChannel } = require("./connection");

const fileService = require("../services/file.service");

const startRPCServer = async () => {
    const channel = getChannel();

    const queue = "project.rpc";

    await channel.assertQueue(queue, {
        durable: true,
    });

    channel.consume(queue, async (msg) => {

        const request = JSON.parse(msg.content.toString());

        let response = null;

        switch (request.action) {

            case "CHECK_FILE_EXISTS":

                response = await fileService.CheckFileExists(request.data.fileId);

                break;

            case "GET_FILE_INFO":

                response = await fileService.GetFile(request.data.fileId);

                break;

            case "CHECK_FILE_EXISTS":

                response = await fileService.getFilesByIds(request.data.fileIds);

                break;

            default:

                response = {
                    success: false,
                    message: "Unknown Action"
                };

        }

        channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(response)),
            {
                correlationId: msg.properties.correlationId
            }
        );

        channel.ack(msg);

    });
};

module.exports = {
    startRPCServer
};