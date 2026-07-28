const { getChannel } = require("./connection");
const { randomUUID } = require("crypto");

const request = async (queue, payload) => {

    const channel = getChannel();

    const replyQueue = await channel.assertQueue("", {
        exclusive: true
    });

    const correlationId = randomUUID();

    return new Promise((resolve) => {

        channel.consume(
            replyQueue.queue,
            (msg) => {

                if (
                    msg.properties.correlationId === correlationId
                ) {
                    resolve(
                        JSON.parse(
                            msg.content.toString()
                        )
                    );
                }

            },
            {
                noAck: true
            }
        );

        channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(payload)),
            {
                correlationId,
                replyTo: replyQueue.queue
            }
        );

    });

};

module.exports = {
    request
};