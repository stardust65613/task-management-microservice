
<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const projectId = computed(
  () => projectStore.currentProject?.id
);

const form = reactive({
  name: "",
  description: "",
  visibility: "private",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

watch(
  () => projectStore.currentProject,
  (project) => {
    if (!project) return;

    form.name = project.name ?? "";
    form.description = project.description ?? "";
    form.visibility = project.visibility ?? "private";
  },
  { immediate: true }
);

async function handleUpdate() {
  error.value = "";
  success.value = false;

  if (!form.name.trim()) {
    error.value = "Project name is required.";
    return;
  }

  loading.value = true;

  try {
    await projectStore.updateProject(projectId.value, {
      name: form.name.trim(),
      description: form.description.trim(),
      visibility: form.visibility,
    });

    success.value = true;
    router.back();
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update project.";
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  router.back();
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        Edit Project
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Update your project information.
      </p>
    </div>

    <form
      class="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      @submit.prevent="handleUpdate"
    >
      <!-- Project name -->
      <div>
        <label
          for="name"
          class="mb-1 block text-sm font-medium text-gray-700"
        >
          Project name
        </label>

        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          maxlength="100"
          placeholder="Enter project name"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <!-- Description -->
      <div>
        <label
          for="description"
          class="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          placeholder="Describe your project"
          class="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        ></textarea>
      </div>

      <!-- Visibility -->
      <div>
        <label
          for="visibility"
          class="mb-1 block text-sm font-medium text-gray-700"
        >
          Visibility
        </label>

        <select
          id="visibility"
          v-model="form.visibility"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>

      <!-- Error -->
      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>

      <!-- Actions -->
      <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          :disabled="loading"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleCancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loading ? "Saving..." : "Save changes" }}
        </button>
      </div>
    </form>
  </div>
</template>
