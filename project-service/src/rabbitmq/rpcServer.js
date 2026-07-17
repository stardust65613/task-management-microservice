const { getChannel } = require("./connection");

const userService = require("../services/user.service");

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