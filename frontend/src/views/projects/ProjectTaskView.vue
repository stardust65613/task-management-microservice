
<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTaskStore } from "@/stores/task.store";

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();

const { tasks, pagination, loading } = storeToRefs(taskStore);

const projectId = computed(() => route.params.id);

async function loadTasks(page = 1) {
  if (!projectId.value) return;

  try {
    await taskStore.getTasksByProject(
      projectId.value,
      page,
      pagination.value.limit
    );
  } catch (err) {
    console.error("Failed to load project tasks:", err);
  }
}

function changePage(page) {
  if (
    page < 1 ||
    page > pagination.value.totalPages ||
    page === pagination.value.page
  ) {
    return;
  }

  loadTasks(page);
}

function goBack() {
  router.back();
}

watch(projectId, () => {
  loadTasks(1);
});

onMounted(() => {
  loadTasks(1);
});
</script>

<template>
  <div class="mx-auto max-w-7xl p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Project Tasks
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          View and manage tasks in this project.
        </p>
      </div>

      <button
        type="button"
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="goBack"
      >
        Back
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500"
    >
      Loading tasks...
    </div>

    <template v-else>
      <!-- Task table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="px-5 py-3 font-semibold">Task</th>
                <th class="px-5 py-3 font-semibold">Status</th>
                <th class="px-5 py-3 font-semibold">Priority</th>
                <th class="px-5 py-3 font-semibold">Assignee</th>
                <th class="px-5 py-3 font-semibold">Due date</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="task in tasks"
                :key="task.id"
                class="hover:bg-gray-50"
              >
                <td class="px-5 py-4">
                  <p class="font-medium text-gray-900">
                    {{ task.title || task.name || "Untitled task" }}
                  </p>
                  <p class="mt-1 max-w-sm truncate text-gray-500">
                    {{ task.description || "No description" }}
                  </p>
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-700':
                        task.status === 'completed' ||
                        task.status === 'done',
                      'bg-blue-100 text-blue-700':
                        task.status === 'in_progress',
                      'bg-gray-100 text-gray-700':
                        !['completed', 'done', 'in_progress'].includes(task.status),
                    }"
                  >
                    {{ task.status || "Unknown" }}
                  </span>
                </td>

                <td class="px-5 py-4 text-gray-700">
                  {{ task.priority || "—" }}
                </td>

                <td class="px-5 py-4 text-gray-700">
                  {{
                    task.assignee?.username ||
                    task.assignee?.name ||
                    task.assignee?.email ||
                    task.assigneeName ||
                    "Unassigned"
                  }}
                </td>

                <td class="px-5 py-4 text-gray-700">
                  {{
                    task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"
                  }}
                </td>
              </tr>

              <tr v-if="tasks.length === 0">
                <td
                  colspan="5"
                  class="px-5 py-12 text-center text-gray-500"
                >
                  No tasks found in this project.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 0"
        class="mt-5 flex flex-wrap items-center justify-between gap-4"
      >
        <p class="text-sm text-gray-500">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
          <span class="mx-1">·</span>
          {{ pagination.total }} tasks
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="pagination.page <= 1"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            @click="changePage(pagination.page - 1)"
          >
            Previous
          </button>

          <button
            type="button"
            :disabled="pagination.page >= pagination.totalPages"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            @click="changePage(pagination.page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
