
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useTaskStore } from "@/stores/task.store";
import { useProjectStore } from "@/stores/project.store";

const route = useRoute();
const router = useRouter();

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const { members } = storeToRefs(projectStore);

const projectId = computed(() => route.params.id);

const submitting = ref(false);
const loadingMembers = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const syncError = ref(false);
const created = ref(false);

const form = reactive({
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  assigneeId: "",
  dueDate: "",
});

const statuses = [
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Review", value: "REVIEW" },
  { label: "Done", value: "DONE" },
  { label: "Cancelled", value: "CANCELLED" },
];

const priorities = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

async function loadMembers() {
  if (!projectId.value) return;

  try {
    loadingMembers.value = true;
    await projectStore.getMembers(projectId.value);
  } catch (error) {
    console.error("Failed to load project members:", error);
    errorMessage.value = "Failed to load project members.";
  } finally {
    loadingMembers.value = false;
  }
}

function validateForm() {
  if (!form.title.trim()) {
    errorMessage.value = "Task title is required.";
    return false;
  }

  if (form.dueDate) {
    const selectedDate = new Date(`${form.dueDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime())) {
      errorMessage.value = "Invalid due date.";
      return false;
    }
  }

  return true;
}

async function handleSubmit() {
  if (submitting.value || created.value) return;

  errorMessage.value = "";
  successMessage.value = "";
  syncError.value = false;

  if (!validateForm()) return;

  try {
    submitting.value = true;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      assigneeId: form.assigneeId || null,
      dueDate: form.dueDate
        ? new Date(`${form.dueDate}T00:00:00`).toISOString()
        : null,
    };

    await taskStore.createTask(projectId.value, payload);

    created.value = true;
    successMessage.value = "Task created successfully.";

    try {
      await taskStore.getAllTasksByProject(projectId.value);
      router.back();
    } catch (error) {
      console.error("Task created, but failed to refresh tasks:", error);
      syncError.value = true;
      errorMessage.value =
        "Task was created, but the task list could not be refreshed. Please return to the board and reload.";
    }
  } catch (error) {
    console.error("Failed to create task:", error);

    errorMessage.value =
      error.response?.data?.message || "Failed to create task.";
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.back();
}

onMounted(loadMembers);
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
    <div class="mx-auto max-w-3xl">

      <!-- Header -->
      <div class="mb-6">
        <button
          type="button"
          @click="goBack"
          class="mb-4 inline-flex items-center gap-2 text-sm font-medium
                 text-gray-500 transition hover:text-gray-900
                 dark:text-gray-400 dark:hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to project
        </button>

        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Create Task
        </h1>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new task for this project.
        </p>
      </div>

      <!-- Form Card -->
      <form
        @submit.prevent="handleSubmit"
        class="space-y-6 rounded-xl border border-gray-200 bg-white p-6
               shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8"
      >

        <!-- Title -->
        <div>
          <label
            for="title"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Task title <span class="text-red-500">*</span>
          </label>

          <input
            id="title"
            v-model="form.title"
            type="text"
            maxlength="255"
            required
            placeholder="Enter task title"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                   text-sm text-gray-900 outline-none transition
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   dark:border-gray-600 dark:bg-gray-800 dark:text-white
                   dark:placeholder-gray-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label
            for="description"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>

          <textarea
            id="description"
            v-model="form.description"
            rows="5"
            placeholder="Describe the task..."
            class="w-full resize-y rounded-lg border border-gray-300 bg-white
                   px-4 py-3 text-sm text-gray-900 outline-none transition
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   dark:border-gray-600 dark:bg-gray-800 dark:text-white
                   dark:placeholder-gray-500"
          ></textarea>
        </div>

        <!-- Status and Priority -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label
              for="status"
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>

            <select
              id="status"
              v-model="form.status"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                     text-sm text-gray-900 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                     dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option
                v-for="status in statuses"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
          </div>

          <div>
            <label
              for="priority"
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Priority
            </label>

            <select
              id="priority"
              v-model="form.priority"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                     text-sm text-gray-900 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                     dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option
                v-for="priority in priorities"
                :key="priority.value"
                :value="priority.value"
              >
                {{ priority.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Assignee -->
        <div>
          <label
            for="assignee"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Assignee
          </label>

          <select
            id="assignee"
            v-model="form.assigneeId"
            :disabled="loadingMembers"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                   text-sm text-gray-900 outline-none transition
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   disabled:cursor-not-allowed disabled:opacity-60
                   dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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

          <p
            v-if="loadingMembers"
            class="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
          >
            Loading project members...
          </p>
        </div>

        <!-- Due Date -->
        <div>
          <label
            for="dueDate"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Due date
          </label>

          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                   text-sm text-gray-900 outline-none transition
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3
                 text-sm text-red-700 dark:border-red-900/50
                 dark:bg-red-950/40 dark:text-red-400"
        >
          {{ errorMessage }}
        </div>

        <!-- Success -->
        <div
          v-if="successMessage"
          class="rounded-lg border border-green-200 bg-green-50 px-4 py-3
                 text-sm text-green-700 dark:border-green-900/50
                 dark:bg-green-950/40 dark:text-green-400"
        >
          {{ successMessage }}
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse justify-end gap-3 border-t
                    border-gray-200 pt-5 dark:border-gray-700 sm:flex-row">

          <button
            type="button"
            @click="goBack"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm
                   font-medium text-gray-700 transition hover:bg-gray-100
                   dark:border-gray-600 dark:text-gray-300
                   dark:hover:bg-gray-800"
          >
            {{ syncError ? "Back to board" : "Cancel" }}
          </button>

          <button
            v-if="!created"
            type="submit"
            :disabled="submitting || loadingMembers"
            class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold
                   text-white transition hover:bg-blue-700
                   disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitting ? "Creating..." : "Create Task" }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
