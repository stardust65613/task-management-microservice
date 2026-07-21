require("dotenv").config();

const app = require("./app");
const { connectRabbitMQ } = require("./rabbitmq/connection");
const { startRPCServer } = require("./rabbitmq/rpcServer");
const { initBucket } = require("./config/minio");
const startConsumer = require("./rabbitmq/file.consumer");

const PORT = process.env.PORT || 3005;

async function startServer() {
    await initBucket();

    await connectRabbitMQ();

    await startRPCServer();

    await startConsumer();

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}

startServer().catch((error) => {
    console.error(error);
    process.exit(1);
});