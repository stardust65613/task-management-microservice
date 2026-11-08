<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useTaskStore } from "@/stores/task.store";

const router = useRouter();
const taskStore = useTaskStore();

const keyword = ref("");
const selectedStatus = ref("");
const selectedPriority = ref("");
const currentPage = ref(1);
const limit = 10;

const loading = computed(() => taskStore.loading);
const tasks = computed(() => taskStore.tasks ?? []);

const pagination = computed(() => taskStore.pagination);

let searchTimeout = null;

const statusOptions = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "REVIEW", label: "Review" },
  { value: "DONE", label: "Done" },
  { value: "CANCELLED", label: "Cancelled" },
];

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const statusClasses = {
  TODO: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  REVIEW: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const priorityClasses = {
  LOW: "text-gray-500 dark:text-gray-400",
  MEDIUM: "text-blue-600 dark:text-blue-400",
  HIGH: "text-orange-600 dark:text-orange-400",
  URGENT: "text-red-600 dark:text-red-400",
};

const formatDate = (date) => {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString("vi-VN");
};

const fetchTasks = async () => {
  try {
    await taskStore.getMyTasks({
      page: currentPage.value,
      limit,
      keyword: keyword.value.trim(),
      status: selectedStatus.value,
      priority: selectedPriority.value,
    });
  } catch (error) {
    console.error("Failed to fetch my tasks:", error);
  }
};

const resetFilters = () => {
  keyword.value = "";
  selectedStatus.value = "";
  selectedPriority.value = "";
  currentPage.value = 1;
};

const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;

  currentPage.value = page;
  fetchTasks();
};

const openTask = (task) => {
  const projectId = task.project?.id;
  const taskId = task.id;

  if (!projectId || !taskId) return;

  router.push(`/tasks/${taskId}`);
};

watch(
  [keyword, selectedStatus, selectedPriority],
  () => {
    clearTimeout(searchTimeout);

    currentPage.value = 1;

    searchTimeout = setTimeout(() => {
      fetchTasks();
    }, 300);
  }
);

onMounted(() => {
  fetchTasks();
});

onUnmounted(() => {
  clearTimeout(searchTimeout);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
        My Tasks
      </h1>

      <p class="mt-1 text-gray-500 dark:text-gray-400">
        View and manage all tasks assigned to you.
      </p>
    </div>

    <!-- Filters -->
    <section
      class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm
             dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="flex flex-col gap-4 lg:flex-row">
        <!-- Search -->
        <input
          v-model="keyword"
          type="text"
          placeholder="Search tasks..."
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2
                 text-gray-800 outline-none focus:border-blue-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-white
                 lg:flex-1"
        />

        <!-- Status -->
        <select
          v-model="selectedStatus"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2
                 text-gray-700 outline-none focus:border-blue-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Priority -->
        <select
          v-model="selectedPriority"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2
                 text-gray-700 outline-none focus:border-blue-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Priorities</option>
          <option
            v-for="option in priorityOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Reset -->
        <button
          @click="resetFilters"
          class="rounded-lg border border-gray-300 px-4 py-2
                 text-gray-600 hover:bg-gray-100
                 dark:border-gray-700 dark:text-gray-300
                 dark:hover:bg-gray-800"
        >
          Reset
        </button>
      </div>
    </section>

    <!-- Task Table -->
    <section
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm
             dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="flex items-center justify-between border-b border-gray-200 p-5
                  dark:border-gray-700"
      >
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          Assigned Tasks
        </h2>

        <button
          @click="fetchTasks"
          class="text-sm font-medium text-blue-600 hover:text-blue-700
                 dark:text-blue-400"
        >
          Refresh
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead
            class="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <tr>
              <th class="px-6 py-4 font-semibold">Task</th>
              <th class="px-6 py-4 font-semibold">Project</th>
              <th class="px-6 py-4 font-semibold">Status</th>
              <th class="px-6 py-4 font-semibold">Priority</th>
              <th class="px-6 py-4 font-semibold">Due Date</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                Loading tasks...
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="tasks.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>

            <!-- Tasks -->
            <tr
              v-for="task in tasks"
              :key="task.id"
              @click="openTask(task)"
              class="cursor-pointer transition hover:bg-gray-50
                     dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4">
                <p class="font-medium text-gray-800 dark:text-white">
                  {{ task.title }}
                </p>

                <p class="mt-1 max-w-xs truncate text-xs text-gray-500">
                  {{ task.description || "No description" }}
                </p>
              </td>

              <td class="px-6 py-4">
                <span class="font-medium text-gray-700 dark:text-gray-300">
                  {{ task.project?.name || "Unknown project" }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-medium"
                  :class="statusClasses[task.status]"
                >
                  {{ task.status?.replace("_", " ") }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="font-semibold"
                  :class="priorityClasses[task.priority]"
                >
                  {{ task.priority }}
                </span>
              </td>

              <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                {{ formatDate(task.dueDate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && pagination.totalPages > 1"
        class="flex items-center justify-between border-t border-gray-200 px-6 py-4
               dark:border-gray-700"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </p>

        <div class="flex gap-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm
                   disabled:cursor-not-allowed disabled:opacity-40
                   dark:border-gray-700 dark:text-gray-300"
          >
            Previous
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= pagination.totalPages"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm
                   disabled:cursor-not-allowed disabled:opacity-40
                   dark:border-gray-700 dark:text-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
