$ErrorActionPreference = "Stop"

Write-Host "====================================="
Write-Host " Task Management Setup"
Write-Host "====================================="

function Setup-BackendService {
    param(
        [string]$Name,
        [string]$Dependencies,
        [string]$DevDependencies,
        [bool]$UsePrisma = $true
    )

    Write-Host ""
    Write-Host "===== $Name ====="

    Set-Location $Name

    if (!(Test-Path "package.json")) {
        npm init -y
    }

    npm install $Dependencies

    npm install -D $DevDependencies

    if ($UsePrisma) {
        if (!(Test-Path "prisma")) {
            npx prisma init
        }
    }

    Set-Location ..
}

##################################################
# Gateway
##################################################

Setup-BackendService `
-Name "gateway" `
-Dependencies "express dotenv cors helmet morgan axios express-rate-limit http-proxy-middleware jsonwebtoken redis winston" `
-DevDependencies "nodemon eslint prettier jest supertest" `
-UsePrisma $false

##################################################
# Auth
##################################################

Setup-BackendService `
-Name "auth-service" `
-Dependencies "express dotenv cors helmet morgan bcrypt jsonwebtoken cookie-parser zod axios redis winston @prisma/client" `
-DevDependencies "prisma nodemon eslint prettier jest supertest"

##################################################
# Project
##################################################

Setup-BackendService `
-Name "project-service" `
-Dependencies "express dotenv cors helmet morgan jsonwebtoken zod axios winston @prisma/client" `
-DevDependencies "prisma nodemon eslint prettier jest supertest"

##################################################
# Task
##################################################

Setup-BackendService `
-Name "task-service" `
-Dependencies "express dotenv cors helmet morgan jsonwebtoken zod socket.io amqplib uuid multer axios redis winston @prisma/client" `
-DevDependencies "prisma nodemon eslint prettier jest supertest"

##################################################
# Notification
##################################################

Setup-BackendService `
-Name "notification-service" `
-Dependencies "express dotenv cors helmet morgan socket.io nodemailer amqplib winston @prisma/client" `
-DevDependencies "prisma nodemon eslint prettier jest supertest"

##################################################
# File
##################################################

Setup-BackendService `
-Name "file-service" `
-Dependencies "express dotenv cors helmet morgan multer uuid minio winston @prisma/client" `
-DevDependencies "prisma nodemon eslint prettier jest supertest"

##################################################
# Frontend
##################################################

Write-Host ""
Write-Host "===== Frontend ====="

Set-Location frontend

if (!(Test-Path "package.json")) {

    npm create vite@latest . -- --template vue

}

npm install

npm install `
vue-router `
pinia `
axios `
socket.io-client `
@vueuse/core `
vue-toastification@next

Set-Location ..

##################################################
# Git
##################################################

if (!(Test-Path ".gitignore")) {

@"
node_modules
.env
dist
coverage
uploads
logs
"@ | Out-File ".gitignore"

}

##################################################
# README
##################################################

if (!(Test-Path "README.md")) {

@"
# Task Management

Microservice Project

- Gateway
- Auth Service
- Project Service
- Task Service
- Notification Service
- File Service
- Vue Frontend

"@ | Out-File "README.md"

}

Write-Host ""
Write-Host "====================================="
Write-Host " Setup Completed Successfully"
Write-Host "====================================="
