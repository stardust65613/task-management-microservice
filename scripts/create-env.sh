#!/bin/bash

##############################################################################
# Create .env.example files
##############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

create_env() {

    FILE=$1
    CONTENT=$2

    if [ -f "$FILE" ]; then
        echo -e "${YELLOW}Exists :${NC} $FILE"
    else
        echo "$CONTENT" > "$FILE"
        echo -e "${GREEN}Created:${NC} $FILE"
    fi

}

echo ""
echo -e "${BLUE}Creating .env.example files...${NC}"

########################################################
# Gateway
########################################################

create_env "gateway/.env.example" 'PORT=3000

NODE_ENV=development

JWT_SECRET=your_jwt_secret

AUTH_SERVICE_URL=http://auth-service:3001
PROJECT_SERVICE_URL=http://project-service:3002
TASK_SERVICE_URL=http://task-service:3003
NOTIFICATION_SERVICE_URL=http://notification-service:3004
FILE_SERVICE_URL=http://file-service:3005

REDIS_URL=redis://redis:6379
'

########################################################
# Auth Service
########################################################

create_env "auth-service/.env.example" 'PORT=3001

NODE_ENV=development

DATABASE_URL=postgresql://postgres:password@postgres-auth:5432/auth_db

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret

REDIS_URL=redis://redis:6379
'

########################################################
# Project Service
########################################################

create_env "project-service/.env.example" 'PORT=3002

NODE_ENV=development

DATABASE_URL=postgresql://postgres:password@postgres-project:5432/project_db
'

########################################################
# Task Service
########################################################

create_env "task-service/.env.example" 'PORT=3003

NODE_ENV=development

DATABASE_URL=postgresql://postgres:password@postgres-task:5432/task_db

REDIS_URL=redis://redis:6379

RABBITMQ_URL=amqp://rabbitmq
'

########################################################
# Notification Service
########################################################

create_env "notification-service/.env.example" 'PORT=3004

NODE_ENV=development

DATABASE_URL=postgresql://postgres:password@postgres-notification:5432/notification_db

RABBITMQ_URL=amqp://rabbitmq

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=example@gmail.com
SMTP_PASSWORD=your_password
'

########################################################
# File Service
########################################################

create_env "file-service/.env.example" 'PORT=3005

NODE_ENV=development

DATABASE_URL=postgresql://postgres:password@postgres-file:5432/file_db

MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=task-management
'

########################################################
# Frontend
########################################################

create_env "frontend/.env.example" 'VITE_API_URL=http://localhost:3000/api

VITE_SOCKET_URL=http://localhost:3003
'

echo ""
echo -e "${GREEN}.env.example files created successfully.${NC}"
