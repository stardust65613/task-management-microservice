const consume = async (
    exchange,
    queue,
    routingKey,
    handler
) => {

    const channel = getChannel();

    await channel.assertExchange(
        exchange,
        "topic",
        {
            durable: true,
        }
    );

    await channel.assertQueue(queue, {
        durable: true,
    });

    await channel.bindQueue(
        queue,
        exchange,
        routingKey
    );

    channel.consume(queue, async (msg) => {

        if (!msg) return;

        const data = JSON.parse(
            msg.content.toString()
        );

        await handler(data);

        channel.ack(msg);

    });

};