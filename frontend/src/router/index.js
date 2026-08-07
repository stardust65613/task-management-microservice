import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import DashboardView from "@/views/dashboard/DashboardView.vue";

import { useAuthStore } from "@/stores/auth.store";

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
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "dashboard",
        component: DashboardView,
      },
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

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.accessToken) {
    return { name: "login" };
  }
});

export default router;