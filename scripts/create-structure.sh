#!/bin/bash

##############################################################################
# Create Project Structure
##############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}Creating project structure...${NC}"

SERVICES=(
gateway
auth-service
project-service
task-service
notification-service
file-service
)

#########################################
# Backend Services
#########################################

for SERVICE in "${SERVICES[@]}"
do

    echo -e "${GREEN}Creating ${SERVICE}${NC}"

    mkdir -p "$SERVICE/src"

    mkdir -p "$SERVICE/src/config"
    mkdir -p "$SERVICE/src/controllers"
    mkdir -p "$SERVICE/src/routes"
    mkdir -p "$SERVICE/src/services"
    mkdir -p "$SERVICE/src/repositories"
    mkdir -p "$SERVICE/src/middleware"
    mkdir -p "$SERVICE/src/models"
    mkdir -p "$SERVICE/src/validation"
    mkdir -p "$SERVICE/src/utils"
    mkdir -p "$SERVICE/src/constants"
    mkdir -p "$SERVICE/src/helpers"
    mkdir -p "$SERVICE/src/logger"
    mkdir -p "$SERVICE/src/events"

    mkdir -p "$SERVICE/tests"

    mkdir -p "$SERVICE/uploads"

    mkdir -p "$SERVICE/logs"

    mkdir -p "$SERVICE/prisma"

done

#########################################
# Frontend
#########################################

echo -e "${GREEN}Creating frontend structure${NC}"

mkdir -p frontend/src

mkdir -p frontend/src/api
mkdir -p frontend/src/assets
mkdir -p frontend/src/components
mkdir -p frontend/src/composables
mkdir -p frontend/src/layouts
mkdir -p frontend/src/router
mkdir -p frontend/src/stores
mkdir -p frontend/src/views
mkdir -p frontend/src/utils
mkdir -p frontend/src/plugins
mkdir -p frontend/src/services

mkdir -p frontend/public

#########################################
# Shared
#########################################

mkdir -p docs

mkdir -p scripts

echo ""
echo -e "${GREEN}Project structure created successfully.${NC}"
