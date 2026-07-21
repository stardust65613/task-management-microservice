// src/rabbitmq/connection.js

const amqp = require("amqplib");

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
    if (connection && channel) {
        return { connection, channel };
    }

    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);

        connection.on("error", (err) => {
            console.error("RabbitMQ Connection Error:", err);
        });

        connection.on("close", () => {
            console.log("RabbitMQ Connection Closed");
            connection = null;
            channel = null;
        });

        channel = await connection.createChannel();

        channel.on("error", (err) => {
            console.error("RabbitMQ Channel Error:", err);
        });

        channel.on("close", () => {
            console.log("RabbitMQ Channel Closed");
        });

        console.log("RabbitMQ Connected");

        return { connection, channel };
    } catch (error) {
        console.error("Failed to connect RabbitMQ:", error);
        throw error;
    }
};

const getConnection = () => connection;

const getChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel has not been initialized");
    }

    return channel;
};

const closeRabbitMQ = async () => {
    if (channel) {
        await channel.close();
    }

    if (connection) {
        await connection.close();
    }

    channel = null;
    connection = null;
};

module.exports = {
    connectRabbitMQ,
    getConnection,
    getChannel,
    closeRabbitMQ,
};