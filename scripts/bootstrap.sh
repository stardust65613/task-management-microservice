#!/bin/bash

##############################################################################
# Task Management Bootstrap
# Author : You
# Version: 1.0
##############################################################################

set -e

ROOT_DIR=$(pwd)
SCRIPT_DIR="$ROOT_DIR/scripts"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo "========================================================="
    echo -e "${BLUE}$1${NC}"
    echo "========================================================="
}

run_script() {

    local script="$1"

    if [ ! -f "$SCRIPT_DIR/$script" ]; then
        echo -e "${RED}ERROR:${NC} Missing script: $script"
        exit 1
    fi

    chmod +x "$SCRIPT_DIR/$script"

    echo -e "${GREEN}Running:${NC} $script"

    "$SCRIPT_DIR/$script"

    echo ""
}

clear

echo "#########################################################"
echo "#                                                       #"
echo "#        TASK MANAGEMENT PROJECT BOOTSTRAP              #"
echo "#                                                       #"
echo "#########################################################"

echo ""

print_header "STEP 1 - CREATE PROJECT STRUCTURE"

run_script create-structure.sh

print_header "STEP 2 - CREATE BACKEND FILES"

run_script create-backend.sh

print_header "STEP 3 - CREATE FRONTEND FILES"

run_script create-frontend.sh

print_header "STEP 4 - CREATE ENV FILES"

run_script create-env.sh

print_header "STEP 5 - CREATE DOCKER"

run_script create-docker.sh

print_header "STEP 6 - CREATE GITIGNORE"

run_script create-gitignore.sh

print_header "STEP 7 - CREATE README"

run_script create-readme.sh

echo ""

echo "#########################################################"

echo -e "${GREEN}BOOTSTRAP FINISHED SUCCESSFULLY${NC}"

echo "#########################################################"

echo ""

echo "Next Step"

echo "1. docker compose up -d"

echo "2. npm install"

echo "3. npx prisma migrate dev"

echo "4. npm run dev"

echo ""
