import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import DashboardView from "@/views/dashboard/DashboardView.vue";
import ProjectListView from "@/views/projects/ProjectListView.vue";
import ProjectDetailView from "@/views/projects/ProjectDetailView.vue";
import CreateProjectView from "@/views/projects/CreateProjectView.vue";
import EditProjectView from "@/views/projects/EditProjectView.vue";
import ProjectSettingView from "@/views/projects/ProjectSettingView.vue";
import ProjectTaskView from "@/views/projects/ProjectTaskView.vue";
import ProjectOverviewView from "@/views/projects/ProjectOverview.vue";
import TaskDetailView from "@/views/tasks/TaskDetailView.vue";
import CreateTaskView from "@/views/tasks/CreateTaskView.vue";
import MyTaskView from "@/views/tasks/MyTaskView.vue";
import NotificationView from "@/views/notifications/NotificationView.vue";

import { useAuthStore } from "@/stores/auth.store";

const routes = [
  {
    path: "/",
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      // Dashboard
      {
        path: "",
        name: "dashboard",
        component: DashboardView,
      },

      // Profile
      {
        path: "profile",
        name: "profile",
        component: ProfileView,
      },

      {
        path: "users/:id",
        name: "user-profile",
        component: ProfileView,
      },

      // Project List
      {
        path: "projects",
        name: "projects",
        component: ProjectListView,
      },

      {
        path: "projects/create",
        name: "project-create",
        component: CreateProjectView,
      },

      // Project Detail
      {
        path: "projects/:id",
        component: ProjectDetailView,
        redirect: (to) => ({
          name: "project-overview",
          params: { id: to.params.id },
        }),
        children: [
          {
            path: "overview",
            name: "project-overview",
            component: ProjectOverviewView,
          },
          {
            path: "tasks",
            name: "project-tasks",
            component: ProjectTaskView,
          },
        ],
      },

      // Edit Project
      {
        path: "projects/:id/edit",
        name: "EditProject",
        component: EditProjectView,
      },

      // Project Settings
      {
        path: "projects/:id/settings",
        name: "ProjectSettings",
        component: ProjectSettingView,
      },

      // Create Task
      {
        path: "projects/:id/tasks/create",
        name: "ProjectTaskCreate",
        component: CreateTaskView,
      },

      {
        path: "tasks/:id",
        name: "TaskDetail",
        component: TaskDetailView,
      },

      {
        path: "tasks",
        name: "MyTaskView",
        component: MyTaskView,
      },

      {
        path: "notifications",
        name: "NotificationView",
        component: NotificationView,
      },
    ],
  },

  // Authentication
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.accessToken) {
    return { name: "login" };
  }
});

export default router;