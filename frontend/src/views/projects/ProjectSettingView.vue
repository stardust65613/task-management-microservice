
<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";
import { useUserStore } from "@/stores/user.store";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const id = computed(
  () => projectStore.user?.id
);

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

watch(
  () => projectStore.currentProject,
  (project) => {
    if (!project) return;

    form.allowMemberInvite = Boolean(project.allowMemberInvite);
    form.allowFileUpload = Boolean(project.allowFileUpload);
  },
  { immediate: true }
);

async function handleSave() {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await projectStore.updateSettings(projectId.value, {
      allowMemberInvite: form.allowMemberInvite,
      allowFileUpload: form.allowFileUpload,
    });

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

function handleCancel() {
  router.back();
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        Project Settings
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Manage permissions for this project.
      </p>
    </div>

    <form
      class="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      @submit.prevent="handleSave"
    >
      <!-- Allow member invitations -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <label
            for="allowMemberInvite"
            class="font-medium text-gray-900"
          >
            Allow member invitations
          </label>
          <p class="mt-1 text-sm text-gray-500">
            Allow project members to invite other members.
          </p>
        </div>

        <input
          id="allowMemberInvite"
          v-model="form.allowMemberInvite"
          type="checkbox"
          class="mt-1 h-4 w-4 accent-blue-600"
        />
      </div>

      <div class="border-t border-gray-100"></div>

      <!-- Allow file uploads -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <label
            for="allowFileUpload"
            class="font-medium text-gray-900"
          >
            Allow file uploads
          </label>
          <p class="mt-1 text-sm text-gray-500">
            Allow members to upload files to this project.
          </p>
        </div>

        <input
          id="allowFileUpload"
          v-model="form.allowFileUpload"
          type="checkbox"
          class="mt-1 h-4 w-4 accent-blue-600"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>

      <p v-if="success" class="text-sm text-green-600">
        Settings updated successfully.
      </p>

      <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          :disabled="loading"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          @click="handleCancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loading ? "Saving..." : "Save settings" }}
        </button>
      </div>
    </form>
  </div>
</template>
