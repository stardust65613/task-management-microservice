<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { getUserStatistic } from "@/services/user.service";
import { getRecentTasks } from "@/services/task.service";

const router = useRouter();

// Statistics
const statistics = ref({
  totalProjects: 0,
  totalTasks: 0,
  todoTasks: 0,
  inProgressTasks: 0,
  reviewTasks: 0,
  completedTasks: 0,
  cancelledTasks: 0,
});

// Recent tasks
const recentTasks = ref([]);

const loading = ref(true);
const error = ref("");

const statCards = [
  {
    title: "Projects",
    key: "totalProjects",
    color: "text-blue-600",
  },
  {
    title: "Tasks",
    key: "totalTasks",
    color: "text-green-600",
  },
  {
    title: "In Progress",
    key: "inProgressTasks",
    color: "text-yellow-500",
  },
  {
    title: "Completed",
    key: "completedTasks",
    color: "text-purple-600",
  },
];

// Task status styles
const statusStyles = {
  TODO: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  IN_PROGRESS:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  REVIEW:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

const getStatusStyle = (status) => {
  return (
    statusStyles[status] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
  );
};

const getStatusLabel = (status) => {
  return statusLabels[status] || status;
};

// Format date
const formatDate = (date) => {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString("vi-VN");
};

// Navigate to task detail
const goToTaskDetail = (taskId) => {
  router.push(`/tasks/${taskId}`);
};

// Fetch dashboard data
const fetchDashboard = async () => {
  loading.value = true;
  error.value = "";

  try {
    const [statisticResponse, recentTaskResponse] = await Promise.all([
      getUserStatistic(),
      getRecentTasks({ limit: 5 }),
    ]);

    statistics.value = statisticResponse.data.data;
    recentTasks.value = recentTaskResponse.data.data;
  } catch (err) {
    console.error("Failed to load dashboard:", err);
    error.value = "Failed to load dashboard data.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboard);
</script>

<template>
  <div class="space-y-8">

    <!-- Title -->
    <div>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h1>

      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Welcome back! Here's an overview of your workspace.
      </p>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="py-10 text-center text-gray-500 dark:text-gray-400"
    >
      Loading dashboard...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}

      <button
        class="ml-2 font-semibold underline"
        @click="fetchDashboard"
      >
        Retry
      </button>
    </div>

    <template v-else>

      <!-- Statistics -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div
          v-for="stat in statCards"
          :key="stat.key"
          class="rounded-xl bg-white p-6 shadow
                 dark:border dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 class="text-gray-500 dark:text-gray-400">
            {{ stat.title }}
          </h2>

          <p class="mt-3 text-3xl font-bold" :class="stat.color">
            {{ statistics[stat.key] }}
          </p>
        </div>

      </div>

      <!-- Recent Tasks -->
      <div
        class="rounded-xl bg-white p-6 shadow
               dark:border dark:border-gray-700 dark:bg-gray-800"
      >

        <h2 class="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-100">
          Recent Tasks
        </h2>

        <!-- Empty state -->
        <div
          v-if="recentTasks.length === 0"
          class="py-8 text-center text-gray-500 dark:text-gray-400"
        >
          No recent tasks found.
        </div>

        <!-- Task list -->
        <div
          v-else
          class="divide-y divide-gray-200 dark:divide-gray-700"
        >

          <div
            v-for="task in recentTasks"
            :key="task.id"
            @click="goToTaskDetail(task.id)"
            class="flex cursor-pointer flex-col justify-between gap-3 py-4
                   transition hover:bg-gray-50
                   dark:text-gray-100 dark:hover:bg-gray-700/30
                   sm:flex-row sm:items-center"
          >

            <!-- Task information -->
            <div class="min-w-0">
              <p class="truncate font-medium text-gray-800 dark:text-gray-100">
                {{ task.title }}
              </p>

              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Project: {{ task.project?.name || "Unknown project" }}
              </p>

              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Due: {{ formatDate(task.dueDate) }}
              </p>
            </div>

            <!-- Task status -->
            <span
              class="w-fit shrink-0 rounded-full px-3 py-1 text-sm font-medium"
              :class="getStatusStyle(task.status)"
            >
              {{ getStatusLabel(task.status) }}
            </span>

          </div>

        </div>

      </div>

    </template>
  </div>
</template>