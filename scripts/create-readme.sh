#!/bin/bash

##############################################################################
# Create README.md
##############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

FILE="README.md"

if [ -f "$FILE" ]; then
    echo -e "${YELLOW}Exists :${NC} $FILE"
    exit 0
fi

cat > "$FILE" << 'EOF'
# Task Management Microservice

A Task Management System built with **Node.js, Express, Vue 3, PostgreSQL, Prisma, Redis, RabbitMQ, Docker, and Microservice Architecture**.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Redis
- RabbitMQ
- Docker

---

### Frontend

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Socket.io Client

---

## Architecture

gateway
↓
auth-service
↓
project-service
↓
task-service
↓
notification-service
↓
file-service

---

## Project Structure

task-management/

├── gateway/

├── auth-service/

├── project-service/

├── task-service/

├── notification-service/

├── file-service/

├── frontend/

├── scripts/

├── docker-compose.yml

└── README.md

---

## Services

### Gateway

- API Gateway
- Authentication Middleware
- Rate Limiting
- Reverse Proxy

---

### Auth Service

- Login
- Register
- JWT
- Refresh Token
- Role & Permission

---

### Project Service

- CRUD Project
- Members
- Project Settings

---

### Task Service

- CRUD Task
- Kanban
- Comment
- Label
- Attachment

---

### Notification Service

- Email
- WebSocket
- RabbitMQ Consumer

---

### File Service

- Upload File
- Download File
- Image Management

---

## Database

Each service owns its own database.

auth_db

project_db

task_db

notification_db

file_db

---

## Run Project

Install packages

npm install

Start docker

docker compose up -d

Run migration

npx prisma migrate dev

Start backend

npm run dev

Start frontend

npm run dev

---

## Default Ports

Gateway : 3000

Auth : 3001

Project : 3002

Task : 3003

Notification : 3004

File : 3005

Frontend : 5173

PostgreSQL : 5432

Redis : 6379

RabbitMQ : 5672

RabbitMQ Dashboard : 15672

MinIO API : 9000

MinIO Console : 9001

---

## Author

Intern Project
EOF

echo ""
echo -e "${GREEN}README.md created successfully.${NC}"
