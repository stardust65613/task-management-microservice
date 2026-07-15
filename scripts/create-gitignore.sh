#!/bin/bash

##############################################################################
# Create .gitignore Files
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
echo -e "${BLUE}Creating .gitignore files...${NC}"

########################################################
# Root .gitignore
########################################################

create_file ".gitignore" '
########################################
# Node
########################################

node_modules/

########################################
# Environment
########################################

.env
.env.*

!.env.example

########################################
# Logs
########################################

logs/
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

########################################
# Coverage
########################################

coverage/

########################################
# Build
########################################

dist/
build/

########################################
# Prisma
########################################

prisma/dev.db

########################################
# Uploads
########################################

uploads/

########################################
# IDE
########################################

.vscode/
.idea/

########################################
# OS
########################################

.DS_Store
Thumbs.db

########################################
# Temporary
########################################

.tmp
.cache

########################################
# Docker
########################################

docker-data/

########################################
# Test
########################################

.nyc_output/

'

########################################################
# Service .gitignore
########################################################

for SERVICE in "${SERVICES[@]}"
do

create_file "$SERVICE/.gitignore" '
node_modules/

.env
.env.*

!.env.example

logs/

coverage/

dist/

uploads/

*.log

'

done

echo ""
echo -e "${GREEN}.gitignore files created successfully.${NC}"
