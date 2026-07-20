# RabbitMQ trong Microservice

## Event vs RPC

**Event:** dùng publisher + consumer + exchange

Ví dụ: Project tạo → Notification gửi email.

**RPC:** dùng rpcClient + rpcServer

Ví dụ: Project hỏi Auth "user này tồn tại không?"

---

# 1. Cấu trúc thư mục

Mỗi service có thư mục RabbitMQ riêng:

Ví dụ:

```text
project-service/
└── src/
    ├── rabbitmq/
    │   ├── connection.js
    │   ├── publisher.js
    │   ├── consumer.js
    │   ├── rpcClient.js
    │   ├── constants.js
    │   └── registerConsumers.js
    │
    ├── services/
    ├── controllers/
    ├── repositories/
    └── server.js
```

Auth Service thêm:

```text
auth-service/
└── src/
    └── rabbitmq/
        ├── connection.js
        ├── rpcServer.js
        ├── publisher.js
        └── constants.js
```

---

# 2. `.env`

Mỗi service:

```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

---

# 3. `connection.js`

**File:**

`src/rabbitmq/connection.js`

### Nhiệm vụ

- Connect RabbitMQ.
- Tạo Channel.
- Export channel cho các file khác dùng.

```javascript
const amqp = require("amqplib");

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {

    if (connection && channel) {
        return;
    }

    connection = await amqp.connect(
        process.env.RABBITMQ_URL
    );

    connection.on("error", (err)=>{
        console.log("RabbitMQ error:", err);
    });

    connection.on("close", ()=>{
        console.log("RabbitMQ closed");
        connection = null;
        channel = null;
    });

    channel = await connection.createChannel();

    console.log("RabbitMQ connected");

};

const getChannel = () => {

    if (!channel) {
        throw new Error(
            "RabbitMQ not connected"
        );
    }

    return channel;
};

module.exports = {
    connectRabbitMQ,
    getChannel
};
```

---

# 4. `constants.js`

**File:**

`src/rabbitmq/constants.js`

Quản lý tên:

```javascript
module.exports = {

    exchanges: {

        PROJECT:
            "project.exchange",

        TASK:
            "task.exchange"

    },

    routingKeys: {

        PROJECT_CREATED:
            "project.created",

        TASK_CREATED:
            "task.created"

    },

    queues: {

        NOTIFICATION:
            "notification.queue",

        AUTH_RPC:
            "auth.rpc"

    }

};
```

---

# PHẦN A: EVENT SYSTEM

---

# 5. `publisher.js`

**File:**

`src/rabbitmq/publisher.js`

Dùng khi service phát event.

Ví dụ:

Project created

```javascript
const { getChannel } = require("./connection");

const publish = async (
    exchange,
    routingKey,
    message
)=>{

    const channel = getChannel();

    await channel.assertExchange(
        exchange,
        "topic",
        {
            durable:true
        }
    );

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(
            JSON.stringify(message)
        )
    );

};

module.exports = {
    publish
};
```

### Cách dùng publisher

Ví dụ:

`project.service.js`

```javascript
const {
    publish
}=require("../rabbitmq/publisher");

const createProject = async(data)=>{

    const project =
        await projectRepository.create(data);

    await publish(

        "project.exchange",

        "project.created",

        project

    );

    return project;

};
```

### Flow

```text
HTTP
 |
Controller
 |
Service
 |
Repository
 |
Publisher
 |
RabbitMQ
```

---

# 6. `consumer.js`

**File:**

`src/rabbitmq/consumer.js`

### Nhiệm vụ

- Bind queue vào exchange.
- Nhận event.

```javascript
const {
    getChannel
}=require("./connection");

const consume = async(
    exchange,
    queue,
    routingKey,
    handler
)=>{

const channel=getChannel();

await channel.assertExchange(
    exchange,
    "topic",
    {
        durable:true
    }
);

await channel.assertQueue(
    queue,
    {
        durable:true
    }
);

await channel.bindQueue(
    queue,
    exchange,
    routingKey
);

channel.consume(
    queue,
    async(msg)=>{

        if(!msg)
            return;

        const data =
            JSON.parse(
                msg.content.toString()
            );

        await handler(data);

        channel.ack(msg);

    }
);

};

module.exports={
    consume
};
```

---

# 7. `registerConsumers.js`

**File:**

`src/rabbitmq/registerConsumers.js`

Nơi khai báo service nghe event nào.

Ví dụ Notification Service:

```javascript
const {
    consume
}=require("./consumer");

const notificationService =
require("../services/notification.service");

const startConsumers = async()=>{

await consume(

    "project.exchange",

    "notification.queue",

    "project.created",

    notificationService.sendProjectCreatedEmail

);

};

module.exports={
    startConsumers
};
```

---

# PHẦN B: RPC SYSTEM

---

# 8. `rpcServer.js` (Auth Service)

**File:**

`auth-service/src/rabbitmq/rpcServer.js`

Auth lắng nghe:

`auth.rpc`

```javascript
const {
    getChannel
}=require("./connection");

const userService =
require("../services/user.service");

const startRPCServer = async()=>{

const channel=getChannel();

await channel.assertQueue(
    "auth.rpc",
    {
        durable:true
    }
);

channel.consume(
"auth.rpc",
async(msg)=>{

const request =
JSON.parse(
msg.content.toString()
);

let response;

switch(request.action){

case "CHECK_USER":

response =
await userService.checkUserExists(
    request.data.userId
);

break;

default:

response={
    success:false,
    message:"Unknown action"
};

}

channel.sendToQueue(

msg.properties.replyTo,

Buffer.from(
JSON.stringify(response)
),

{
correlationId:
msg.properties.correlationId
}

);

channel.ack(msg);

});

};

module.exports={
    startRPCServer
};
```

---

# 9. `rpcClient.js` (Project Service)

**File:**

`project-service/src/rabbitmq/rpcClient.js`

```javascript
const {
    getChannel
}=require("./connection");

const {
    randomUUID
}=require("crypto");

const request = async(
queue,
payload
)=>{

const channel=getChannel();

const replyQueue =
await channel.assertQueue(
"",
{
exclusive:true
}
);

const correlationId =
randomUUID();

return new Promise(
(resolve)=>{

channel.consume(
replyQueue.queue,

(msg)=>{

if(
msg.properties.correlationId
===
correlationId
){

resolve(
JSON.parse(
msg.content.toString()
)
);

}

},

{
noAck:true
}

);

channel.sendToQueue(

queue,

Buffer.from(
JSON.stringify(payload)
),

{

replyTo:
replyQueue.queue,

correlationId

}

);

});

};

module.exports={
request
};
```

### Cách gọi RPC

Trong:

`project.service.js`

```javascript
const {
request
}=require("../rabbitmq/rpcClient");

const addMember = async(userId)=>{

const result =
await request(

"auth.rpc",

{

action:"CHECK_USER",

data:{
    userId
}

}

);

if(!result.exists){

throw new Error(
"User not found"
);

}

};
```

---

# 10. `server.js` khởi động

## Auth Service

```javascript
const {
connectRabbitMQ
}=require("./rabbitmq/connection");

const {
startRPCServer
}=require("./rabbitmq/rpcServer");

async function bootstrap(){

await connectRabbitMQ();

await startRPCServer();

app.listen(PORT);

}

bootstrap();
```

## Project Service

```javascript
await connectRabbitMQ();

await startConsumers();

app.listen(PORT);
```

---

# Tổng kết vai trò file

| File | Vai trò |
|------|----------|
| `connection.js` | Kết nối RabbitMQ + tạo channel |
| `publisher.js` | Gửi event |
| `consumer.js` | Nhận event |
| `registerConsumers.js` | Đăng ký service nghe event nào |
| `rpcClient.js` | Gửi request và chờ response |
| `rpcServer.js` | Nhận RPC và trả kết quả |
| `constants.js` | Lưu exchange, queue, routing key |

---

# Kiến trúc tổng thể

```text
Project Service
    |
    |-- RPC --> Auth Service
    |             (check user)
    |
    |-- Event --> Notification
                  (send email)

Task Service
    |
    |-- Event --> Notification
```

Đây là cấu trúc đủ để triển khai RabbitMQ trong một hệ thống microservice thực tế.