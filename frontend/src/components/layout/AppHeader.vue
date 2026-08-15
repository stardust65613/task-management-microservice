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

defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "toggle-sidebar",
  "toggle-dark",
]);
</script>
<template>
  <header
    class="
      flex
      h-16
      shrink-0
      items-center
      justify-between
      border-b
      border-gray-200
      bg-white
      px-6
      dark:border-gray-700
      dark:bg-gray-900
    "
  >

    <!-- Left -->
    <div class="flex items-center gap-4">

      <!-- Sidebar toggle -->
      <button
        type="button"
        @click="emit('toggle-sidebar')"
        class="
          rounded-lg
          px-3
          py-2
          text-xl
          hover:bg-gray-100
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        ☰
      </button>

      <!-- Search -->
      <div class="w-96">
        <input
          type="text"
          placeholder="Search..."
          class="
            w-full
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-2
            outline-none
            focus:border-blue-500
            dark:border-gray-700
            dark:bg-gray-800
            dark:text-gray-100
            dark:placeholder-gray-400
          "
        />
      </div>

    </div>


    <!-- Right -->
    <div class="flex items-center gap-5">

      <!-- Dark mode -->
      <button
        type="button"
        @click="emit('toggle-dark')"
        class="
          rounded-lg
          px-3
          py-2
          text-xl
          hover:bg-gray-100
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        {{ dark ? "☀️" : "🌙" }}
      </button>


      <!-- Notification -->
      <button class="relative text-2xl">
        🔔

        <span
          class="
            absolute
            -right-2
            -top-1
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-red-500
            text-xs
            text-white
          "
        >
          3
        </span>
      </button>


      <!-- Avatar -->
      <div class="relative">

        <button
          type="button"
          class="flex cursor-pointer items-center gap-3"
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

            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ userStore.user?.email }}
            </p>
          </div>
        </button>


        <!-- User menu -->
        <div
          v-if="showUserMenu"
          class="
            absolute
            right-0
            top-full
            z-50
            mt-2
            w-48
            rounded-lg
            border
            border-gray-200
            bg-white
            py-2
            shadow-lg
            dark:border-gray-700
            dark:bg-gray-800
          "
        >
          <RouterLink
            to="/profile"
            class="
              flex
              items-center
              gap-3
              px-4
              py-2
              text-gray-700
              hover:bg-blue-50
              hover:text-blue-600
              dark:text-gray-200
              dark:hover:bg-gray-700
            "
            @click="showUserMenu = false"
          >
            <span>Profile</span>
          </RouterLink>

          <button
            type="button"
            class="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-2
              text-left
              text-red-500
              hover:bg-red-50
              dark:hover:bg-gray-700
            "
            @click="handleLogout"
          >
            <span>Logout</span>
          </button>
        </div>

      </div>

    </div>

  </header>
</template>