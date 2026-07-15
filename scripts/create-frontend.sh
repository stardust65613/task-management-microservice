#!/bin/bash

##############################################################################
# Create Frontend Starter Files
##############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

FRONTEND="frontend"

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
echo -e "${BLUE}Creating frontend starter files...${NC}"

#########################################
# Directories
#########################################

mkdir -p $FRONTEND/src

mkdir -p $FRONTEND/src/api
mkdir -p $FRONTEND/src/assets
mkdir -p $FRONTEND/src/components
mkdir -p $FRONTEND/src/composables
mkdir -p $FRONTEND/src/layouts
mkdir -p $FRONTEND/src/plugins
mkdir -p $FRONTEND/src/router
mkdir -p $FRONTEND/src/services
mkdir -p $FRONTEND/src/stores
mkdir -p $FRONTEND/src/utils
mkdir -p $FRONTEND/src/views

mkdir -p $FRONTEND/src/views/auth
mkdir -p $FRONTEND/src/views/dashboard
mkdir -p $FRONTEND/src/views/projects
mkdir -p $FRONTEND/src/views/tasks
mkdir -p $FRONTEND/src/views/profile
mkdir -p $FRONTEND/src/views/errors

mkdir -p $FRONTEND/src/components/common
mkdir -p $FRONTEND/src/components/layout
mkdir -p $FRONTEND/src/components/project
mkdir -p $FRONTEND/src/components/task

mkdir -p $FRONTEND/public

#########################################
# Root files
#########################################

create_file "$FRONTEND/src/main.js"

create_file "$FRONTEND/src/App.vue"

#########################################
# Router
#########################################

create_file "$FRONTEND/src/router/index.js"

#########################################
# API
#########################################

create_file "$FRONTEND/src/api/axios.js"

#########################################
# Stores
#########################################

create_file "$FRONTEND/src/stores/auth.store.js"

create_file "$FRONTEND/src/stores/project.store.js"

create_file "$FRONTEND/src/stores/task.store.js"

#########################################
# Plugins
#########################################

create_file "$FRONTEND/src/plugins/toast.js"

#########################################
# Services
#########################################

create_file "$FRONTEND/src/services/auth.service.js"

create_file "$FRONTEND/src/services/project.service.js"

create_file "$FRONTEND/src/services/task.service.js"

create_file "$FRONTEND/src/services/upload.service.js"

#########################################
# Utils
#########################################

create_file "$FRONTEND/src/utils/constants.js"

create_file "$FRONTEND/src/utils/helpers.js"

#########################################
# Layouts
#########################################

create_file "$FRONTEND/src/layouts/MainLayout.vue"

create_file "$FRONTEND/src/layouts/AuthLayout.vue"

#########################################
# Views
#########################################

create_file "$FRONTEND/src/views/auth/LoginView.vue"

create_file "$FRONTEND/src/views/auth/RegisterView.vue"

create_file "$FRONTEND/src/views/dashboard/DashboardView.vue"

create_file "$FRONTEND/src/views/projects/ProjectListView.vue"

create_file "$FRONTEND/src/views/projects/ProjectDetailView.vue"

create_file "$FRONTEND/src/views/tasks/TaskListView.vue"

create_file "$FRONTEND/src/views/tasks/TaskDetailView.vue"

create_file "$FRONTEND/src/views/profile/ProfileView.vue"

create_file "$FRONTEND/src/views/errors/NotFoundView.vue"

#########################################
# Components
#########################################

create_file "$FRONTEND/src/components/common/BaseButton.vue"

create_file "$FRONTEND/src/components/common/BaseInput.vue"

create_file "$FRONTEND/src/components/common/BaseModal.vue"

create_file "$FRONTEND/src/components/layout/AppHeader.vue"

create_file "$FRONTEND/src/components/layout/AppSidebar.vue"

create_file "$FRONTEND/src/components/layout/AppFooter.vue"

create_file "$FRONTEND/src/components/project/ProjectCard.vue"

create_file "$FRONTEND/src/components/project/ProjectForm.vue"

create_file "$FRONTEND/src/components/task/TaskCard.vue"

create_file "$FRONTEND/src/components/task/TaskForm.vue"

echo ""
echo -e "${GREEN}Frontend starter files created successfully.${NC}"