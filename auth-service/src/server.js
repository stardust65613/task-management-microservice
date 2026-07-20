require("dotenv").config();

const app = require("./app");
const { connectRabbitMQ } = require("./rabbitmq/connection");
const { startRPCServer } = require("./rabbitmq/rpcServer");

const PORT = process.env.PORT || 3001;

async function startServer() {
    await connectRabbitMQ();

    await startRPCServer();

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}
 
startServer().catch((error) => {
    console.error(error);
    process.exit(1);
});