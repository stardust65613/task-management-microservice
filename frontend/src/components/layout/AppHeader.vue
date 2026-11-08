<script setup>
import avatar from "@/assets/avatar.png";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

import { ref, computed, onMounted } from "vue";

import {
  getNotifications,
  markAsRead,
} from "@/services/notification.service";

const userStore = useUserStore();
const authStore = useAuthStore();

const showUserMenu = ref(false);

const showNotificationMenu = ref(false);
const notifications = ref([]);

const unreadCount = computed(
  () => notifications.value.filter((item) => !item.isRead).length
);

const recentNotifications = computed(() =>
  notifications.value.slice(0, 3)
);

const getNotificationId = (item) => item._id || item.id;

const fetchNotifications = async () => {
  try {
    const response = await getNotifications();
    const data = response.data;

    notifications.value = data.data;

  } catch (error) {
    console.error("Failed to load notifications:", error);
  }
};

const handleNotificationClick = async (notification) => {
  if (notification.isRead) return;

  try {
    await markAsRead(getNotificationId(notification));

    notification.isRead = true;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

const toggleNotificationMenu = () => {
  showNotificationMenu.value = !showNotificationMenu.value;

  if (showNotificationMenu.value) {
    fetchNotifications();
  }
};

const closeNotificationMenu = () => {
  showNotificationMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  authStore.logout();
};

onMounted(() => {
  fetchNotifications();
});

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


      
      <!-- Notification Dropdown -->
      <div class="relative">
        <!-- Bell Button -->
        <button
          type="button"
          @click="toggleNotificationMenu"
          class="relative rounded-lg px-3 py-2 text-2xl transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          🔔
          <span
            v-if="unreadCount > 0"
            class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white"
          >
            {{ unreadCount > 99 ? "99+" : unreadCount }}
          </span>
        </button>

        <!-- Dropdown -->
        <div
          v-if="showNotificationMenu"
          class="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:w-96"
        >

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>

              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ unreadCount }} unread
              </p>
            </div>

            <RouterLink
              to="/notifications"
              @click="closeNotificationMenu"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all
            </RouterLink>
          </div>

          <!-- Notification List -->
          <div v-if="recentNotifications.length > 0">

            <div
              v-for="notification in recentNotifications"
              :key="getNotificationId(notification)"
              @click="handleNotificationClick(notification)"
              class="flex cursor-pointer gap-3 border-b border-gray-100 p-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              :class="!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''"
            >

              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                🔔
              </div>

              <div class="min-w-0 flex-1">

                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {{ notification.title || "Notification" }}
                  </p>

                  <span
                    v-if="!notification.isRead"
                    class="h-2 w-2 shrink-0 rounded-full bg-blue-600"
                  ></span>
                </div>

                <p class="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ notification.message || notification.content || "-" }}
                </p>

                <p class="mt-2 text-xs text-gray-400">
                  {{ notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString()
                    : ""
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="p-8 text-center">
            <p class="text-3xl">🔔</p>

            <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
              No notifications yet
            </p>
          </div>

          <!-- Footer -->
          <RouterLink
            to="/notifications"
            @click="closeNotificationMenu"
            class="block border-t border-gray-200 p-3 text-center text-sm font-medium text-blue-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            See all notifications
          </RouterLink>

        </div>
      </div>



      <!-- Avatar -->
      <div class="relative">

        <button
          type="button"
          class="flex cursor-pointer items-center gap-3"
          @click="toggleUserMenu"
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