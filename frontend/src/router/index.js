import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import DashboardView from "@/views/dashboard/DashboardView.vue";

const routes = [
  /*
  {
    path: "/projects",
    name: "projects",
    component: ProjectListView,
  },
  */
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: DashboardView,
      },
    ],
  },

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

export default router;