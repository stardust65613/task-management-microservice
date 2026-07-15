#!/bin/bash

##############################################################################
# Create Backend Starter Files
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
)

create_file() {

    FILE=$1

    if [ ! -f "$FILE" ]; then
        touch "$FILE"
        echo -e "${GREEN}Created:${NC} $FILE"
    else
        echo -e "${YELLOW}Exists :${NC} $FILE"
    fi
}

echo ""
echo -e "${BLUE}Creating backend starter files...${NC}"

for SERVICE in "${SERVICES[@]}"
do

echo ""
echo "========================================="
echo "$SERVICE"
echo "========================================="

########################################
# Root files
########################################

create_file "$SERVICE/src/app.js"
create_file "$SERVICE/src/server.js"

########################################
# Config
########################################

create_file "$SERVICE/src/config/index.js"
create_file "$SERVICE/src/config/logger.js"
create_file "$SERVICE/src/config/database.js"

########################################
# Routes
########################################

create_file "$SERVICE/src/routes/index.js"

########################################
# Middleware
########################################

create_file "$SERVICE/src/middleware/auth.middleware.js"
create_file "$SERVICE/src/middleware/error.middleware.js"
create_file "$SERVICE/src/middleware/notFound.middleware.js"

########################################
# Utils
########################################

create_file "$SERVICE/src/utils/response.js"

########################################
# Logger
########################################

create_file "$SERVICE/src/logger/logger.js"

########################################
# Validation
########################################

create_file "$SERVICE/src/validation/index.js"

########################################
# Service specific
########################################

case $SERVICE in

gateway)

create_file "$SERVICE/src/controllers/gateway.controller.js"

;;

auth-service)

create_file "$SERVICE/src/controllers/auth.controller.js"

create_file "$SERVICE/src/services/auth.service.js"

create_file "$SERVICE/src/repositories/user.repository.js"

create_file "$SERVICE/src/models/user.model.js"

;;

project-service)

create_file "$SERVICE/src/controllers/project.controller.js"

create_file "$SERVICE/src/services/project.service.js"

create_file "$SERVICE/src/repositories/project.repository.js"

create_file "$SERVICE/src/models/project.model.js"

;;

task-service)

create_file "$SERVICE/src/controllers/task.controller.js"

create_file "$SERVICE/src/services/task.service.js"

create_file "$SERVICE/src/repositories/task.repository.js"

create_file "$SERVICE/src/models/task.model.js"

;;

notification-service)

create_file "$SERVICE/src/controllers/notification.controller.js"

create_file "$SERVICE/src/services/notification.service.js"

;;

file-service)

create_file "$SERVICE/src/controllers/file.controller.js"

create_file "$SERVICE/src/services/file.service.js"

;;

esac

done

echo ""
echo -e "${GREEN}Backend starter files created successfully.${NC}"
