<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useTaskStore } from "@/stores/task.store";
import { useProjectStore } from "@/stores/project.store";
import TaskColumn from "@/components/task/TaskColumn.vue";

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const projectStore = useProjectStore();


const { tasks, loadingProjectTasks } = storeToRefs(taskStore);
const { members } = storeToRefs(projectStore);

const assigningTaskId = ref(null);

const projectId = computed(() => route.params.id);

const errorMessage = ref("");
const draggedTask = ref(null);
const updatingTaskId = ref(null);

const columns = [
  {
    title: "To Do",
    status: "TODO",
    dotClass: "bg-gray-400",
  },
  {
    title: "In Progress",
    status: "IN_PROGRESS",
    dotClass: "bg-blue-500",
  },
  {
    title: "Review",
    status: "REVIEW",
    dotClass: "bg-yellow-500",
  },
  {
    title: "Done",
    status: "DONE",
    dotClass: "bg-green-500",
  },
  {
    title: "Cancelled",
    status: "CANCELLED",
    dotClass: "bg-red-500",
  },
];

function getTasksByStatus(status) {
  return tasks.value.filter(
    (task) => task.status === status
  );
}

async function loadMembers() {
  try {
    await projectStore.getMembers(projectId.value);
  } catch (error) {
    console.error("Failed to load project members:", error);
    errorMessage.value = "Failed to load project members.";
  }
}

async function handleAssign({ task, assigneeId }) {
  const taskId = task.id ?? task._id;

  if (
    !taskId ||
    assigningTaskId.value ||
    ["DONE", "CANCELLED"].includes(task.status)
  ) {
    return;
  }

  if (!taskId || assigningTaskId.value) return;

  try {
    errorMessage.value = "";
    assigningTaskId.value = taskId;

    await taskStore.assignTask(taskId, {
      assigneeId,
    });
  } catch (error) {
    console.error("Failed to assign task:", error);
    errorMessage.value =
      error.response?.data?.message || "Failed to update assignee.";
  } finally {
    assigningTaskId.value = null;
  }
}

async function loadTasks() {
  if (!projectId.value) return;

  try {
    errorMessage.value = "";
    await taskStore.getAllTasksByProject(projectId.value);
  } catch (error) {
    console.error("Failed to load project tasks:", error);
    errorMessage.value = "Failed to load tasks.";
  }
}

function handleDragStart(task) {
  draggedTask.value = task;
}

function handleDragEnd() {
  draggedTask.value = null;
}

async function handleDrop(status) {
  const task = draggedTask.value;

  if (!task || updatingTaskId.value) return;

  if (["DONE", "CANCELLED"].includes(task.status)) {
    draggedTask.value = null;
    return;
  }

  if (task.status === status) {
    draggedTask.value = null;
    return;
  }

  try {
    errorMessage.value = "";
    updatingTaskId.value = task.id;

    await taskStore.updateTask(task.id, {
      status,
    });
  } catch (error) {
    console.error("Failed to update task status:", error);
    errorMessage.value = "Could not update task status.";

    // Đồng bộ lại dữ liệu từ backend nếu cập nhật thất bại.
    await loadTasks();
  } finally {
    updatingTaskId.value = null;
    draggedTask.value = null;
  }
}

function goBack() {
  router.back();
}

function viewTaskDetails(task) {
  const taskId = task.id ?? task._id;

  router.push({
    name: "TaskDetail",
    params: {
      id: taskId,
    },
  });
}

watch(
  projectId,
  () => {
    draggedTask.value = null;
    loadTasks();
    loadMembers();
  },
  { immediate: true }
);
</script>

<template>
  <div class="mx-auto max-w-full p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Project Tasks
        </h1>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your project tasks using Kanban board.
        </p>
      </div>

      <button
        type="button"
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        @click="goBack"
      >
        Back
      </button>
    </div>

    <button
      @click="router.push({
        name: 'ProjectTaskCreate',
        params: { id: projectId }
      })"
      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium
            text-white transition hover:bg-blue-700"
    >
      + Create Task
    </button>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ errorMessage }}
    </div>

    <!-- Loading -->
    <div
      v-if="loadingProjectTasks"
      class="py-16 text-center text-gray-500"
    >
      Loading tasks...
    </div>

    <template v-else>
      <!-- Kanban board -->
      <div class="overflow-x-auto pb-4">
        <div class="grid min-w-[1100px] grid-cols-5 items-start gap-4">
          <TaskColumn
            v-for="column in columns"
            :key="column.status"
            :column="column"
            :tasks="getTasksByStatus(column.status)"
            :members="members"
            :dragged-task="draggedTask"
            :updating-task-id="updatingTaskId"
            :assigning-task-id="assigningTaskId"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @drop-task="handleDrop"
            @view-details="viewTaskDetails"
            @assign="handleAssign"
          />
        </div>
      </div>

      <!-- Empty board -->
      <div
        v-if="tasks.length === 0"
        class="mt-4 text-center text-sm text-gray-500"
      >
        No tasks found in this project.
      </div>
    </template>
  </div>
</template>
