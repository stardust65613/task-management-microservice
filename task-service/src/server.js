require("dotenv").config();

const app = require("./app");
const { connectRabbitMQ } = require("./rabbitmq/connection");
const { startRPCServer } = require("./rabbitmq/rpcServer");
const startConsumer = require("./rabbitmq/task.consumer");

const PORT = process.env.PORT || 3003;

async function startServer() {
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