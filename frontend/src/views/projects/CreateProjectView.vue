<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";
import { useUserStore } from "@/stores/user.store";

const router = useRouter();
const projectStore = useProjectStore();
const userStore = useUserStore();

const name = ref("");
const description = ref("");
const visibility = ref("PRIVATE");
const loading = ref(false);
const errorMessage = ref("");

async function createProject() {
  errorMessage.value = "";

  const projectName = name.value.trim();

  if (!projectName) {
    errorMessage.value = "Project name is required.";
    return;
  }

  loading.value = true;

  try {
    await projectStore.createProject({
      name: projectName,
      description: description.value.trim(),
      ownerId: userStore.user.id,
      visibility: visibility.value,
    });

    await router.push("/projects");
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create project. Please try again.";
  } finally {
    loading.value = false;
  }
}

function cancel() {
  router.push("/projects");
}
</script>

<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button
      type="button"
      class="flex items-center gap-2 text-sm text-gray-500
             transition hover:text-blue-600 dark:text-gray-400
             dark:hover:text-blue-400"
      @click="cancel"
    >
      <span aria-hidden="true">←</span>
      Back to projects
    </button>

    <!-- Main Content -->
    <div class="mx-auto max-w-3xl space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-semibold text-gray-800 dark:text-white">
          Create Project
        </h1>

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Create a new project to organize your work and collaborate with others.
        </p>
      </div>

      <!-- Form -->
      <form
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm
               dark:border-gray-700 dark:bg-gray-900 sm:p-8"
        @submit.prevent="createProject"
      >
        <!-- Project Icon -->
        <div
          class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl
                 bg-blue-100 text-3xl dark:bg-blue-900/30"
        >
          📁
        </div>

        <!-- Project Name -->
        <div class="mb-6">
          <label
            for="project-name"
            class="mb-2 block text-sm font-medium text-gray-700
                   dark:text-gray-300"
          >
            Project name <span class="text-red-500">*</span>
          </label>

          <input
            id="project-name"
            v-model="name"
            type="text"
            maxlength="100"
            required
            autofocus
            placeholder="Enter your project name"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3
                   text-gray-800 outline-none transition
                   placeholder:text-gray-400
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                   dark:border-gray-700 dark:bg-gray-800 dark:text-white
                   dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
          />

          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Choose a clear name that describes your project.
          </p>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label
            for="project-description"
            class="mb-2 block text-sm font-medium text-gray-700
                   dark:text-gray-300"
          >
            Description
            <span class="font-normal text-gray-400">(Optional)</span>
          </label>

          <textarea
            id="project-description"
            v-model="description"
            rows="5"
            maxlength="1000"
            placeholder="Describe what this project is about..."
            class="w-full resize-y rounded-lg border border-gray-300
                   bg-white px-4 py-3 text-gray-800 outline-none transition
                   placeholder:text-gray-400
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                   dark:border-gray-700 dark:bg-gray-800 dark:text-white
                   dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
          ></textarea>

          <p class="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
            {{ description.length }}/1000
          </p>
        </div>

        <!-- Visibility -->
        <div class="mb-6">
          <label
            for="project-visibility"
            class="mb-2 block text-sm font-medium text-gray-700
                   dark:text-gray-300"
          >
            Visibility
          </label>

          <select
            id="project-visibility"
            v-model="visibility"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3
                   text-gray-800 outline-none transition
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                   dark:border-gray-700 dark:bg-gray-800 dark:text-white
                   dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
          >
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
          </select>

          <p
            v-if="visibility === 'PRIVATE'"
            class="mt-2 text-xs text-gray-500 dark:text-gray-400"
          >
            Only you and authorized collaborators can access this project.
          </p>

          <p
            v-else
            class="mt-2 text-xs text-gray-500 dark:text-gray-400"
          >
            This project can be visible to other users, depending on your
            application's access rules.
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          role="alert"
          class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3
                 text-sm text-red-600
                 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400"
        >
          {{ errorMessage }}
        </div>

        <!-- Actions -->
        <div
          class="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6
                 dark:border-gray-700 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-5 py-2.5
                   font-medium text-gray-700 transition hover:bg-gray-100
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:border-gray-700 dark:text-gray-300
                   dark:hover:bg-gray-800"
            :disabled="loading"
            @click="cancel"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="flex items-center justify-center gap-2 rounded-lg
                   bg-blue-600 px-5 py-2.5 font-medium text-white
                   transition hover:bg-blue-700
                   disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading || !name.trim()"
          >
            <span
              v-if="loading"
              class="h-4 w-4 animate-spin rounded-full border-2
                     border-white/40 border-t-white"
            ></span>

            {{ loading ? "Creating..." : "Create Project" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
