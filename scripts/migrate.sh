#!/bin/bash

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVICES=(
  auth-service
  project-service
  task-service
  notification-service
  file-service
)

echo -e "${BLUE}Running Prisma migrations...${NC}"

for SERVICE in "${SERVICES[@]}"
do
    echo ""
    echo -e "${GREEN}Migrating ${SERVICE}${NC}"

    cd "$SERVICE"

    npx prisma migrate dev --name init

    cd ..
done

echo ""
echo -e "${GREEN}All migrations completed successfully!${NC}"