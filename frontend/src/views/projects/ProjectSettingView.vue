<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";

const router = useRouter();
const projectStore = useProjectStore();

const projectId = computed(
  () => projectStore.currentProject?.id
);

const form = reactive({
  allowMemberInvite: false,
  allowFileUpload: false,
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

// Load settings when project changes
watch(
  projectId,
  async (id) => {
    if (!id) return;

    loading.value = true;
    error.value = "";
    success.value = false;

    try {
      await projectStore.getSettings(id);

      // Get settings from Pinia store
      const settings = projectStore.settings;

      form.allowMemberInvite = Boolean(
        settings?.allowMemberInvite
      );

      form.allowFileUpload = Boolean(
        settings?.allowFileUpload
      );
    } catch (err) {
      error.value =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load project settings.";
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);

// Save settings
async function handleSave() {
  if (!projectId.value || loading.value) return;

  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await projectStore.updateSettings(projectId.value, {
      allowMemberInvite: form.allowMemberInvite,
      allowFileUpload: form.allowFileUpload,
    });

    // Refresh settings from API
    await projectStore.getSettings(projectId.value);

    success.value = true;
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update project settings.";
  } finally {
    loading.value = false;
  }
}

// Cancel
function handleCancel() {
  router.back();
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Project Settings
      </h1>

      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage permissions for this project.
      </p>
    </div>

    <!-- Settings Form -->
    <form
      class="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      @submit.prevent="handleSave"
    >

      <!-- Loading -->
      <div
        v-if="loading && !projectStore.settings"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        Loading settings...
      </div>

      <!-- Allow member invitations -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <label
            for="allowMemberInvite"
            class="font-medium text-gray-900 dark:text-gray-100"
          >
            Allow member invitations
          </label>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Allow project members to invite other members.
          </p>
        </div>

        <input
          id="allowMemberInvite"
          v-model="form.allowMemberInvite"
          type="checkbox"
          :disabled="loading"
          class="mt-1 h-4 w-4 accent-blue-600 disabled:cursor-not-allowed"
        />
      </div>

      <div class="border-t border-gray-100 dark:border-gray-700"></div>

      <!-- Allow file uploads -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <label
            for="allowFileUpload"
            class="font-medium text-gray-900 dark:text-gray-100"
          >
            Allow file uploads
          </label>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Allow members to upload files to this project.
          </p>
        </div>

        <input
          id="allowFileUpload"
          v-model="form.allowFileUpload"
          type="checkbox"
          :disabled="loading"
          class="mt-1 h-4 w-4 accent-blue-600 disabled:cursor-not-allowed"
        />
      </div>

      <!-- Error -->
      <p
        v-if="error"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ error }}
      </p>

      <!-- Success -->
      <p
        v-if="success"
        class="text-sm text-green-600 dark:text-green-400"
      >
        Settings updated successfully.
      </p>

      <!-- Actions -->
      <div
        class="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-700"
      >
        <button
          type="button"
          :disabled="loading"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="handleCancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="loading || !projectId"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {{ loading ? "Saving..." : "Save settings" }}
        </button>
      </div>

    </form>
  </div>
</template>