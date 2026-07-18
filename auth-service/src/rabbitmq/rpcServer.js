const { getChannel } = require("./connection");

const userService = require("../services/user.service");

const startRPCServer = async () => {
    const channel = getChannel();

    const queue = "auth.rpc";

    await channel.assertQueue(queue, {
        durable: true,
    });

    channel.consume(queue, async (msg) => {

        const request = JSON.parse(msg.content.toString());

        let response = null;

        switch (request.action) {

            case "CHECK_USER":

                response = await userService.CheckUserExists(
                    request.data.userId
                );

                break;

            case "GET_USERS_BY_IDS":
                response = await userService.getUsersByIds(
                    request.data.userIds
                );
                
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