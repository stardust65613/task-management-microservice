<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const loading = ref(true);
const error = ref("");
const project = ref(null);

const deleting = ref(false);
const deleteError = ref("");

async function loadProject() {
  try {
    loading.value = true;
    error.value = "";

    project.value = await projectStore.getProject(route.params.id);
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      "Failed to load project.";

    project.value = null;
  } finally {
    loading.value = false;
  }
}

async function deleteProject() {
  if (!project.value?.id || deleting.value) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${project.value.name}"?`
  );

  if (!confirmed) return;

  deleting.value = true;
  deleteError.value = "";

  try {
    await projectStore.deleteProject(project.value.id);
    router.push("/projects");
  } catch (err) {
    deleteError.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete project.";
  } finally {
    deleting.value = false;
  }
}

function goBack() {
  router.push("/projects");
}

function editProject() {
  router.push(`/projects/${route.params.id}/edit`);
}

function projectSettings() {
  router.push(`/projects/${route.params.id}/settings`);
}

watch(
  () => route.params.id,
  loadProject,
  { immediate: true }
);
</script>

<template>
  <div class="space-y-6">

    <!-- Back -->
    <button
      type="button"
      class="flex items-center gap-2 text-sm text-gray-500
             transition hover:text-blue-600
             dark:text-gray-400 dark:hover:text-blue-400"
      @click="goBack"
    >
      ← Back to projects
    </button>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex justify-center py-16"
    >
      <div
        class="h-10 w-10 animate-spin rounded-full border-4
               border-gray-300 border-t-blue-600"
      ></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-6
             text-center text-red-600 dark:border-red-900
             dark:bg-red-950/30 dark:text-red-400"
    >
      {{ error }}
    </div>

    <template v-else-if="project">

      <!-- Project Header -->
      <section
        class="flex flex-col gap-4 rounded-xl border border-gray-200
               bg-white p-6 shadow-sm dark:border-gray-700
               dark:bg-gray-900 sm:flex-row sm:items-center
               sm:justify-between"
      >
        <!-- Project Info -->
        <div class="flex items-center gap-4">

          <div
            class="flex h-14 w-14 shrink-0 items-center justify-center
                   rounded-xl bg-blue-100 text-3xl
                   dark:bg-blue-900/30"
          >
            📁
          </div>

          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ project.name }}
            </h1>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ project.description || "No description" }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-2">

          <button
            type="button"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm
                   font-medium text-white transition hover:bg-blue-700"
            @click="editProject"
          >
            Edit
          </button>

          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2
                   text-sm font-medium text-gray-700 transition
                   hover:bg-gray-100 dark:border-gray-600
                   dark:text-gray-200 dark:hover:bg-gray-800"
            @click="projectSettings"
          >
            ⚙ Settings
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm
                   font-medium text-white transition hover:bg-red-700
                   disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="deleting"
            @click="deleteProject"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>

        <p
          v-if="deleteError"
          class="text-sm text-red-600 dark:text-red-400"
        >
          {{ deleteError }}
        </p>
      </section>

      <!-- Tabs -->
      <nav
        class="flex gap-6 border-b border-gray-200
               dark:border-gray-700"
      >
        <RouterLink
          :to="{
            name: 'project-overview',
            params: { id: project.id }
          }"
          class="border-b-2 border-transparent px-3 py-3
                 text-sm font-medium text-gray-500 transition
                 hover:text-blue-600
                 [&.router-link-active]:border-blue-600
                 [&.router-link-active]:text-blue-600
                 dark:text-gray-400"
        >
          Overview
        </RouterLink>

        <RouterLink
          :to="{
            name: 'project-tasks',
            params: { id: project.id }
          }"
          class="border-b-2 border-transparent px-3 py-3
                 text-sm font-medium text-gray-500 transition
                 hover:text-blue-600
                 [&.router-link-active]:border-blue-600
                 [&.router-link-active]:text-blue-600
                 dark:text-gray-400"
        >
          Tasks
        </RouterLink>
      </nav>

      <!-- Nested Route Content -->
      <RouterView v-slot="{ Component }">
        <component
          :is="Component"
          :project="project"
        />
      </RouterView>

    </template>
  </div>
</template>
