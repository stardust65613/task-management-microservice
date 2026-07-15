#!/bin/bash

##############################################################################
# Create Docker Files
##############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVICES=(
gateway
auth-service
project-service
task-service
notification-service
file-service
frontend
)

create_file() {

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
echo -e "${BLUE}Creating Docker files...${NC}"

#######################################################
# Dockerfile
#######################################################

for SERVICE in "${SERVICES[@]}"
do

create_file "$SERVICE/Dockerfile" 'FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run","dev"]'

done

#######################################################
# .dockerignore
#######################################################

for SERVICE in "${SERVICES[@]}"
do

create_file "$SERVICE/.dockerignore" 'node_modules

npm-debug.log

.env

dist

coverage

logs'

done

#######################################################
# docker-compose.yml
#######################################################

create_file "docker-compose.yml" 'version: "3.9"

services:

  postgres:

    image: postgres:17

    container_name: postgres

    restart: always

    environment:

      POSTGRES_USER: postgres

      POSTGRES_PASSWORD: password

    ports:

      - "5432:5432"

    volumes:

      - postgres_data:/var/lib/postgresql/data

  redis:

    image: redis:7-alpine

    container_name: redis

    restart: always

    ports:

      - "6379:6379"

  rabbitmq:

    image: rabbitmq:4-management

    container_name: rabbitmq

    restart: always

    ports:

      - "5672:5672"

      - "15672:15672"

  minio:

    image: minio/minio

    container_name: minio

    command: server /data --console-address ":9001"

    environment:

      MINIO_ROOT_USER: minioadmin

      MINIO_ROOT_PASSWORD: minioadmin

    ports:

      - "9000:9000"

      - "9001:9001"

    volumes:

      - minio_data:/data

volumes:

  postgres_data:

  minio_data:
'

echo ""
echo -e "${GREEN}Docker files created successfully.${NC}"
