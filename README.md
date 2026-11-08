# Hệ thống Quản lý Công việc (Task Management Microservice)

Task Management Microservice được xây dựng bằng Node.js, Express.js, Vue 3, PostgreSQL, Prisma, RabbitMQ và Docker, áp dụng kiến trúc Microservices.

## Introduction

Task Management Microservice là hệ thống quản lý công việc theo kiến trúc microservices, hỗ trợ người dùng tạo, phân công, theo dõi và quản lý các tác vụ trong quá trình làm việc nhóm. Hệ thống giúp tổ chức công việc hiệu quả, phối hợp giữa các thành viên và theo dõi tiến độ thực hiện dự án.

## Tính năng

- **Quản lý dự án:** Tạo, chỉnh sửa và xóa project; quản lý thành viên, thêm hoặc xóa member và phân quyền truy cập theo từng vai trò.

- **Quản lý công việc:** Tạo, chỉnh sửa và xóa task; hỗ trợ đính kèm tệp (attachment) và trao đổi thông qua bình luận (comment) trên từng task.

- **Quản lý vòng đời công việc:** Theo dõi và cập nhật trạng thái task bằng thao tác kéo thả (Drag & Drop) trực quan trên bảng quản lý công việc.

- **Thông báo qua email:** Tự động gửi email đến người được giao công việc (assignee) khi có task mới và thông báo khi người dùng được mời tham gia project.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | Vue.js, Vite, Pinia, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Prisma, JWT Authentication |
| Message Broker | RabbitMQ |
| Object Storage | RustFS |
| Containerization | Docker, Docker Compose |


## Architecture

```text
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│    Auth    │ │  Project   │ │    Task    │ │Notification│ │    File    │
│  Service   │ │  Service   │ │  Service   │ │  Service   │ │  Service   │
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

---

## Project Structure

```text
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
```

---

## Services

### 1. Gateway
- API Gateway
- Authentication Middleware
- Rate Limiting

### 2. Auth Service
- User Registration & Login
- JWT Authentication
- Refresh Token

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

### 6. File Service
- File Upload & Download
- Image Management

---

## Database

Mỗi microservice sở hữu và quản lý database riêng, đảm bảo tính độc lập và khả năng hoạt động riêng biệt của từng service.

| Service | Database |
| :--- | :--- |
| Auth Service | `auth_db` |
| Project Service | `project_db` |
| Task Service | `task_db` |
| Notification Service | `notification_db` |
| File Service | `file_db` |

---
## Cài đặt và khởi chạy
### 1. Clone repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Cấu hình môi trường

Tạo file `.env` dựa trên file `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các thông tin cấu hình và credentials cần thiết trong file `.env`.

### 3. Khởi chạy dự án

Sử dụng Docker Compose để khởi chạy toàn bộ hệ thống:

```bash
docker compose up -d --build
```

### 4. Kiểm tra trạng thái

```bash
docker compose ps
```

Xem logs:

```bash
docker compose logs -f
```

### 5. Truy cập ứng dụng

| Dịch vụ | Địa chỉ |
|---|---|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:3000 |
| RabbitMQ Dashboard | http://localhost:15672 |
| RustFS Console | http://localhost:9001 |

### 6. Dừng dự án

```bash
docker compose down
```

> Lưu ý: Không sử dụng `docker compose down -v` nếu muốn giữ lại dữ liệu trong Docker volumes.
---

## Default Ports

| Service | Port |
| :--- | :--- |
| API Gateway | `3000` |
| Auth Service | `3001` |
| Project Service | `3002` |
| Task Service | `3003` |
| Notification Service | `3004` |
| File Service | `3005` |
| Frontend (Vite) | `5173` |
| PostgreSQL | `5432` |
| RabbitMQ | `5672` |
| RabbitMQ Management Dashboard | `15672` |
| RustFS API | `9000` |
| RustFS Console | `9001` |

---
