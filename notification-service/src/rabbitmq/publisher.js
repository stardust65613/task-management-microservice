const { getChannel } = require("./connection");
const publish = async (
    exchange,
    routingKey,
    message
) => {

    const channel = getChannel();

    await channel.assertExchange(
        exchange,
        "topic",
        {
            durable: true,
        }
    );

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message))
    );
};

module.exports = {
    publish,
}