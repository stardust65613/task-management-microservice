#!/bin/bash

set -e

echo "========================================="
echo "Task Management Project Setup"
echo "========================================="

BACKEND_SERVICES=(
"gateway"
"auth-service"
"project-service"
"task-service"
"notification-service"
"file-service"
)

########################################
# Gateway
########################################

setup_gateway() {

cd gateway

[ ! -f package.json ] && npm init -y

npm install \
express \
dotenv \
cors \
helmet \
morgan \
axios \
express-rate-limit \
http-proxy-middleware \
jsonwebtoken \
redis \
winston

npm install -D \
nodemon \
eslint \
prettier \
jest \
supertest

cd ..
}

########################################
# Auth
########################################

setup_auth() {

cd auth-service

[ ! -f package.json ] && npm init -y

npm install \
express \
dotenv \
cors \
helmet \
morgan \
bcrypt \
jsonwebtoken \
cookie-parser \
zod \
axios \
redis \
winston \
@prisma/client

npm install -D \
prisma \
nodemon \
eslint \
prettier \
jest \
supertest

[ ! -d prisma ] && npx prisma init

cd ..
}

########################################
# Project
########################################

setup_project() {

cd project-service

[ ! -f package.json ] && npm init -y

npm install \
express \
dotenv \
cors \
helmet \
morgan \
jsonwebtoken \
zod \
axios \
winston \
@prisma/client

npm install -D \
prisma \
nodemon \
eslint \
prettier \
jest \
supertest

[ ! -d prisma ] && npx prisma init

cd ..
}

########################################
# Task
########################################

setup_task() {

cd task-service

[ ! -f package.json ] && npm init -y

npm install \
express \
dotenv \
cors \
helmet \
morgan \
jsonwebtoken \
zod \
socket.io \
amqplib \
uuid \
multer \
axios \
redis \
winston \
@prisma/client

npm install -D \
prisma \
nodemon \
eslint \
prettier \
jest \
supertest

[ ! -d prisma ] && npx prisma init

cd ..
}

########################################
# Notification
########################################

setup_notification() {

cd notification-service

[ ! -f package.json ] && npm init -y

npm install \
express \
dotenv \
cors \
helmet \
morgan \
socket.io \
nodemailer \
amqplib \
winston \
@prisma/client

npm install -D \
prisma \
nodemon \
eslint \
prettier \
jest \
supertest

[ ! -d prisma ] && npx prisma init

cd ..
}

########################################
# File
########################################

setup_file() {

cd file-service

[ ! -f package.json ] && npm init -y

npm install \
express \
dotenv \
cors \
helmet \
morgan \
multer \
uuid \
minio \
winston \
@prisma/client

npm install -D \
prisma \
nodemon \
eslint \
prettier \
jest \
supertest

[ ! -d prisma ] && npx prisma init

cd ..
}

########################################
# Frontend
########################################

setup_frontend() {

cd frontend

if [ ! -f package.json ]; then
    npm create vite@latest . -- --template vue
fi

npm install

npm install \
vue-router \
pinia \
axios \
socket.io-client \
@vueuse/core \
vue-toastification@next

cd ..
}

########################################
# Main
########################################

setup_gateway
setup_auth
setup_project
setup_task
setup_notification
setup_file
setup_frontend

echo ""

echo "========================================="
echo "Setup completed successfully!"
echo "========================================="