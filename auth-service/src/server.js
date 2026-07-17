require("dotenv").config();

const app = require("./app");
const { connectRabbitMQ } = require("./rabbitmq/connection");
const { startRPCServer } = require("./rabbitmq/rpcServer");

const PORT = process.env.PORT || 3001;

await connectRabbitMQ();

await startRPCServer();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});