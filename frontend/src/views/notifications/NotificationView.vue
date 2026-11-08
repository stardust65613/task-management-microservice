<script setup>
import { computed, onMounted, ref } from "vue";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/services/notification.service";

const notifications = ref([]);
const loading = ref(false);
const error = ref("");
const processingIds = ref([]);

const unreadCount = computed(
  () => notifications.value.filter((item) => !item.isRead).length
);

const extractNotifications = (response) => {
  const data = response.data;

  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const fetchNotifications = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getNotifications();
    notifications.value = extractNotifications(response);
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to load notifications.";
  } finally {
    loading.value = false;
  }
};

const getId = (notification) =>
  notification._id || notification.id;

const handleMarkAsRead = async (notification) => {
  if (notification.isRead) return;

  const id = getId(notification);
  if (!id || processingIds.value.includes(id)) return;

  processingIds.value.push(id);

  try {
    await markAsRead(id);
    notification.isRead = true;
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to mark notification as read.";
  } finally {
    processingIds.value = processingIds.value.filter(
      (item) => item !== id
    );
  }
};

const handleMarkAllAsRead = async () => {
  if (unreadCount.value === 0) return;

  try {
    await markAllAsRead();

    notifications.value.forEach((notification) => {
      notification.isRead = true;
    });
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to mark all as read.";
  }
};

const handleDelete = async (notification) => {
  const id = getId(notification);
  if (!id || processingIds.value.includes(id)) return;

  processingIds.value.push(id);

  try {
    await deleteNotification(id);

    notifications.value = notifications.value.filter(
      (item) => getId(item) !== id
    );
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to delete notification.";
  } finally {
    processingIds.value = processingIds.value.filter(
      (item) => item !== id
    );
  }
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleString();
};

const getNotificationType = (type) => {
  const types = {
    TASK: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    PROJECT: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    SYSTEM: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };

  return types[type] || types.SYSTEM;
};

onMounted(fetchNotifications);
</script>

<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
          Notifications
        </h1>

        <p class="mt-1 text-gray-500 dark:text-gray-400">
          View and manage your notifications.
        </p>
      </div>

      <button
        v-if="unreadCount > 0"
        type="button"
        @click="handleMarkAllAsRead"
        class="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
      >
        Mark all as read
      </button>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

      <div
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Total Notifications
        </p>

        <p class="mt-2 text-3xl font-bold text-blue-600">
          {{ notifications.length }}
        </p>
      </div>

      <div
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Unread Notifications
        </p>

        <p class="mt-2 text-3xl font-bold text-orange-500">
          {{ unreadCount }}
        </p>
      </div>

    </div>

    <!-- Notifications List -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >

      <!-- Section Header -->
      <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            All Notifications
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ notifications.length }} notifications
          </p>
        </div>

        <button
          type="button"
          @click="fetchNotifications"
          :disabled="loading"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="m-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
      >
        {{ error }}
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="p-12 text-center text-gray-500 dark:text-gray-400"
      >
        Loading notifications...
      </div>

      <!-- Empty -->
      <div
        v-else-if="notifications.length === 0"
        class="p-12 text-center"
      >
        <div class="text-5xl">🔔</div>

        <h3 class="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
          No notifications yet
        </h3>

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You're all caught up!
        </p>
      </div>

      <!-- List -->
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">

        <div
          v-for="notification in notifications"
          :key="getId(notification)"
          class="flex flex-col gap-4 p-6 transition hover:bg-gray-50 sm:flex-row sm:items-start dark:hover:bg-gray-700/40"
          :class="!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''"
        >

          <!-- Icon -->
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl dark:bg-blue-900/40">
            🔔
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1">

            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ notification.title || "Notification" }}
              </h3>

              <span
                v-if="notification.type"
                class="rounded-full px-2.5 py-1 text-xs font-medium"
                :class="getNotificationType(notification.type)"
              >
                {{ notification.type }}
              </span>

              <span
                v-if="!notification.isRead"
                class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              >
                Unread
              </span>
            </div>

            <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {{ notification.message || notification.content || "-" }}
            </p>

            <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
              {{ formatDate(notification.createdAt) }}
            </p>

          </div>

          <!-- Actions -->
          <div class="flex shrink-0 items-center gap-3 sm:justify-end">

            <button
              v-if="!notification.isRead"
              type="button"
              @click="handleMarkAsRead(notification)"
              :disabled="processingIds.includes(getId(notification))"
              class="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400"
            >
              Mark as read
            </button>

            <button
              type="button"
              @click="handleDelete(notification)"
              :disabled="processingIds.includes(getId(notification))"
              class="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              Delete
            </button>

          </div>

        </div>

      </div>
    </div>

  </div>
</template>
