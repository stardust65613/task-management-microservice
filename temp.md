### Gateway
npm install express dotenv cors helmet morgan axios express-rate-limit http-proxy-middleware jsonwebtoken

npm install -D nodemon eslint prettier

### Auth
npm install express dotenv cors helmet morgan bcrypt jsonwebtoken cookie-parser zod axios @prisma/client

npm install prisma -D

npm install -D nodemon eslint prettier
### Project
npm install express dotenv cors helmet morgan jsonwebtoken zod axios @prisma/client

npm install prisma -D

npm install -D nodemon eslint prettier

### Task
npm install express dotenv cors helmet morgan jsonwebtoken zod socket.io amqplib uuid axios @prisma/client

npm install multer

npm install prisma -D

npm install -D nodemon eslint prettier

### Notification

npm install express dotenv cors helmet morgan socket.io nodemailer amqplib @prisma/client

npm install prisma -D

npm install -D nodemon eslint prettier

### File
 
npm install express dotenv cors helmet morgan multer uuid @prisma/client

npm install minio

npm install prisma -D

npm install -D nodemon eslint prettier

### Frontend 
npm install

npm install vue-router pinia axios socket.io-client vue-toastification@next @vueuse/core

npm install -D tailwindcss @tailwindcss/vite

task-management/
│
├── scripts/
│   ├── bootstrap.sh          # Chạy toàn bộ bootstrap
│   ├── create-structure.sh   # Tạo cấu trúc thư mục
│   ├── create-backend.sh     # Tạo file backend
│   ├── create-frontend.sh    # Tạo file frontend
│   ├── create-env.sh         # Tạo .env.example
│   ├── create-docker.sh      # Tạo Dockerfile + docker-compose
│   ├── create-readme.sh      # Tạo README.md
│   └── create-gitignore.sh   # Tạo .gitignore
│
├── gateway/
├── auth-service/
├── project-service/
├── task-service/
├── notification-service/
├── file-service/
├── frontend/
│
├── docker-compose.yml
├── README.md
└── .gitignore

### Đổi client

Quy trình nên làm:

Sửa schema.prisma
generator client {
  provider = "prisma-client-js"
}
Xóa:
src/generated/
Chạy
npm install @prisma/client
Chạy
npx prisma generate

Lệnh này chỉ generate Prisma Client, không đụng database.

Cài PostgreSQL adapter
npm install @prisma/adapter-pg pg

### /src/lib/prisma.js

```
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

module.exports = prisma;
```

### migration dùng
npx prisma migrate dev --name init

