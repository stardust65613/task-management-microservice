<script setup>
import { onMounted } from "vue";
import { useTaskStore } from "@/stores/task.store";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.getTasksByProject(props.projectId);
});
</script>

<template>
  <!-- Loading -->
  <div
    v-if="taskStore.loading"
    class="flex justify-center py-8"
  >
    <div
      class="
        h-8
        w-8
        animate-spin
        rounded-full
        border-4
        border-gray-300
        border-t-blue-600
      "
    ></div>
  </div>

  <!-- Empty -->
  <div
    v-else-if="taskStore.tasks.length === 0"
    class="
      rounded-lg
      border
      border-dashed
      border-gray-300
      p-8
      text-center
      dark:border-gray-700
    "
  >
    <div class="text-3xl">
      ✅
    </div>

    <p
      class="
        mt-3
        text-sm
        text-gray-500
        dark:text-gray-400
      "
    >
      No tasks in this project
    </p>
  </div>

  <!-- Task list -->
  <div
    v-else
    class="space-y-3"
  >
    <div
      v-for="task in taskStore.tasks"
      :key="task.id"
      class="
        rounded-lg
        border
        border-gray-200
        bg-gray-50
        p-4
        transition
        hover:border-blue-300
        hover:shadow-sm
        dark:border-gray-700
        dark:bg-gray-800
      "
    >
      <!-- Top -->
      <div class="flex items-start justify-between">

        <div class="min-w-0">
          <h3
            class="
              truncate
              font-medium
              text-gray-800
              dark:text-white
            "
          >
            {{ task.title }}
          </h3>

          <p
            class="
              mt-1
              truncate
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {{ task.description || "No description" }}
          </p>
        </div>

        <!-- Status -->
        <span
          class="
            ml-4
            shrink-0
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
          "
          :class="{
            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300':
              task.status === 'TODO',

            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400':
              task.status === 'IN_PROGRESS',

            'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400':
              task.status === 'REVIEW',

            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400':
              task.status === 'DONE',

            'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400':
              task.status === 'CANCELLED',
          }"
        >
          {{ task.status }}
        </span>

      </div>

      <!-- Bottom -->
      <div
        class="
          mt-4
          flex
          items-center
          justify-between
          border-t
          border-gray-200
          pt-3
          dark:border-gray-700
        "
      >

        <!-- Assignee -->
        <div class="flex items-center gap-2">

          <div
            class="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-blue-100
              text-xs
              font-medium
              text-blue-600
              dark:bg-blue-900/30
              dark:text-blue-400
            "
          >
            👤
          </div>

          <span
            class="
              text-sm
              text-gray-600
              dark:text-gray-300
            "
          >
            {{ task.assigneeName || "Unassigned" }}
          </span>

        </div>

        <!-- Assign -->
        <button
          type="button"
          class="
            rounded-lg
            px-3
            py-1.5
            text-sm
            font-medium
            text-blue-600
            hover:bg-blue-50
            dark:text-blue-400
            dark:hover:bg-blue-900/30
          "
          @click="openAssignModal(task)"
        >
          {{ task.assigneeId ? "Reassign" : "Assign" }}
        </button>

      </div>
    </div>
  </div>
</template>