# Task Management Microservice

A Task Management System built with Node.js, Express.js, Vue 3, PostgreSQL, Prisma, Redis, RabbitMQ, Docker, and Microservice Architecture.

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

### Frontend
- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Socket.io Client

---

## Architecture

Client
  |
  v
API Gateway
  |
  +-- Auth Service
  +-- Project Service
  +-- Task Service
  +-- Notification Service
  +-- File Service

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

### 1. Gateway
- API Gateway
- Authentication Middleware
- Rate Limiting
- Reverse Proxy

### 2. Auth Service
- User Registration & Login
- JWT Authentication
- Refresh Token
- Role & Permission Management

### 3. Project Service
- Project CRUD
- Project Members Management
- Project Settings

### 4. Task Service
- Task CRUD
- Kanban Board
- Comments
- Labels
- Attachments

### 5. Notification Service
- Email Notifications
- WebSocket
- RabbitMQ Consumer

### 6. File Service
- File Upload & Download
- Image Management

---

## Database

Each microservice owns and manages its own database to ensure service independence.

| Service | Database |
|---|---|
| Auth Service | auth_db |
| Project Service | project_db |
| Task Service | task_db |
| Notification Service | notification_db |
| File Service | file_db |

---

## Getting Started

### 1. Install Dependencies

npm install

### 2. Start Docker Services

docker compose up -d

### 3. Run Database Migrations

Run Prisma migrations for each service that has a Prisma schema:

npx prisma migrate dev

### 4. Start Backend Services

Run the development command in each backend service:

npm run dev

### 5. Start Frontend

npm run dev

---

## Default Ports

| Service | Port |
|---|---:|
| API Gateway | 3000 |
| Auth Service | 3001 |
| Project Service | 3002 |
| Task Service | 3003 |
| Notification Service | 3004 |
| File Service | 3005 |
| Frontend (Vite) | 5173 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| RabbitMQ | 5672 |
| RabbitMQ Management Dashboard | 15672 |
| RustFS API | 9000 |
| RustFS Console | 9001 |

---

## Author

