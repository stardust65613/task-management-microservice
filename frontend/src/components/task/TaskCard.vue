<script setup>
import { computed } from "vue";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  members: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  assigning: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "drag-start",
  "drag-end",
  "view-details",
  "assign",
]);

const isLocked = computed(() =>
  ["DONE", "CANCELLED"].includes(props.task.status)
);

const currentAssignee = computed(() => {
  if (!props.task.assigneeId) return null;

  const member = props.members.find(
    (item) => item.userId === props.task.assigneeId
  );

  return member?.user || props.task.assignee || null;
});

function formatDate(date) {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString("vi-VN");
}

function priorityClass(priority) {
  const classes = {
    LOW: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return classes[priority] || "bg-gray-100 text-gray-600";
}

function handleAssign(event) {
  emit("assign", {
    task: props.task,
    assigneeId: event.target.value || null,
  });
}
</script>

<template>
  <article
    :draggable="!disabled && !assigning && !isLocked"
    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition
           dark:border-gray-700 dark:bg-gray-800"
    :class="disabled || assigning
      ? 'cursor-wait opacity-60'
      : 'cursor-grab hover:border-blue-300 hover:shadow-md active:cursor-grabbing'"
    @dragstart="emit('drag-start', task)"
    @dragend="emit('drag-end')"
  >
    <!-- Title -->
    <h3 class="font-semibold text-gray-800 dark:text-gray-100">
      {{ task.title || task.name || "Untitled task" }}
    </h3>

    <!-- Description -->
    <p class="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
      {{ task.description || "No description" }}
    </p>

    <!-- Priority and due date -->
    <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
      <span
        v-if="task.priority"
        class="rounded-md px-2 py-1 text-xs font-semibold"
        :class="priorityClass(task.priority)"
      >
        {{ task.priority }}
      </span>

      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ formatDate(task.dueDate) }}
      </span>
    </div>

    <!-- Assignee -->
    <div class="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
      <label
        :for="`assignee-${task.id ?? task._id}`"
        class="mb-2 block text-xs text-gray-500 dark:text-gray-400"
      >
        Assignee
      </label>

      <!-- Current assignee -->
      <div v-if="currentAssignee" class="mb-3 flex items-center gap-2">
        <img
          v-if="currentAssignee.avatar"
          :src="currentAssignee.avatar"
          :alt="currentAssignee.username || 'Assignee avatar'"
          class="h-7 w-7 rounded-full object-cover"
        />

        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ currentAssignee.username || currentAssignee.email }}
        </span>
      </div>

      <select
        :id="`assignee-${task.id ?? task._id}`"
        :value="task.assigneeId ?? ''"
        :disabled="disabled || assigning || isLocked"
        class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2
               text-xs font-medium text-gray-700 outline-none transition
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
               disabled:cursor-not-allowed disabled:opacity-60
               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        @change="handleAssign"
        @click.stop
        @mousedown.stop
        @dragstart.stop
      >
        <option value="">Unassigned</option>

        <option
          v-for="member in members"
          :key="member.userId"
          :value="member.userId"
        >
          {{ member.user?.username || member.user?.email }}
          ({{ member.role }})
        </option>
      </select>

      <p v-if="assigning" class="mt-1 text-xs text-blue-500">
        Updating assignee...
      </p>
    </div>

    <!-- View details -->
    <div class="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
      <button
        type="button"
        class="w-full rounded-lg px-3 py-2 text-sm font-medium text-blue-600
               transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
        @click.stop="emit('view-details', task)"
      >
        View details
      </button>
    </div>

    <p
      v-if="isLocked"
      class="mt-2 text-xs text-gray-400"
    >
      This task is locked.
    </p>
  </article>
</template>