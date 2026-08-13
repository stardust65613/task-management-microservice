<script setup>
import avatar from "@/assets/avatar.png";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { ref } from "vue";

const userStore = useUserStore();
const authStore = useAuthStore();

const showUserMenu = ref(false);

const handleLogout = () => {
  authStore.logout();
};
</script>
<template>
  <header
    class="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between dark:border-gray-700 dark:bg-gray-900"
  >
    <!-- Search -->
    <div class="w-96 dark:text-gray-100">
      <input
        type="text"
        placeholder="Search..."
        class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
      />
    </div>

    <!-- Right -->
    <div class="flex items-center gap-6">

      <!-- Notification -->
      <button class="relative text-2xl">
        🔔

        <span
          class="absolute -top-1 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center"
        >
          3
        </span>
      </button>

      <!-- Avatar -->
      <div class ="relative">
        <button
          type="button"
          class="flex items-center gap-3 cursor-pointer"
          @click="showUserMenu = !showUserMenu"
        >

          <img
            :src="avatar"
            class="h-10 w-10 rounded-full"
          />

          <div>
            <p class="font-medium dark:text-gray-100">
              {{ userStore.user?.username }}
            </p>

            <p class="text-xs text-gray-500 dark:text-gray-100">
              {{ userStore.user?.email }}
            </p>
          </div>

        </button>
      
        <div
          v-if="showUserMenu"
          class="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <RouterLink
            to="/profile"
            class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700"
            @click="showUserMenu = false"
          >
            <span>Profile</span>
          </RouterLink>

          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
            @click="handleLogout"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>