
<script setup>
import TaskCard from "./TaskCard.vue";

defineProps({
  column: {
    type: Object,
    required: true,
  },
  tasks: {
    type: Array,
    default: () => [],
  },
  members: {
    type: Array,
    default: () => [],
  },
  draggedTask: {
    type: Object,
    default: null,
  },
  updatingTaskId: {
    type: [String, Number],
    default: null,
  },
  assigningTaskId: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits([
  "drag-start",
  "drag-end",
  "drop-task",
  "view-details",
  "assign",
]);

function handleDrop(event, status) {
  event.preventDefault();
  emit("drop-task", status);
}
</script>

<template>
  <section
    class="flex min-h-96 flex-col rounded-xl bg-gray-100 p-3 dark:bg-gray-900"
  >
    <!-- Column header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span
          class="h-2.5 w-2.5 rounded-full"
          :class="column.dotClass"
        />

        <h2 class="font-semibold text-gray-800 dark:text-gray-100">
          {{ column.title }}
        </h2>

        <span
          class="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600
                 dark:bg-gray-700 dark:text-gray-300"
        >
          {{ tasks.length }}
        </span>
      </div>
    </div>

    <!-- Drop area -->
    <div
      class="flex flex-1 flex-col gap-3 rounded-lg transition"
      :class="draggedTask ? 'min-h-64' : ''"
      @dragover.prevent
      @drop="handleDrop($event, column.status)"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id ?? task._id"
        :task="task"
        :members="members"
        :disabled="String(updatingTaskId) === String(task.id ?? task._id) || ['DONE', 'CANCELLED'].includes(task.status)"
        :assigning="String(assigningTaskId) === String(task.id ?? task._id)"
        @drag-start="emit('drag-start', $event)"
        @drag-end="emit('drag-end')"
        @view-details="emit('view-details', $event)"
        @assign="emit('assign', $event)"
      />

      <!-- Empty column -->
      <div
        v-if="tasks.length === 0"
        class="flex min-h-32 flex-1 items-center justify-center rounded-lg
               border-2 border-dashed border-gray-300 text-sm text-gray-400
               dark:border-gray-700"
      >
        Drop task here
      </div>
    </div>
  </section>
</template>
