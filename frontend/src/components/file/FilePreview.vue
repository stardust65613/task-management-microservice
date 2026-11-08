<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import * as fileService from "@/services/file.service";

const props = defineProps({
  file: {
    type: Object,
    default: null,
  },
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const previewUrl = ref("");
const loading = ref(false);
const error = ref("");

const isImage = () => props.file?.mimeType?.startsWith("image/");
const isPdf = () => props.file?.mimeType === "application/pdf";

const clearPreview = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = "";
  }
};

const loadPreview = async () => {
  clearPreview();
  error.value = "";

  if (!props.file || (!isImage() && !isPdf())) {
    error.value = "This file type does not support preview";
    return;
  }

  loading.value = true;

  try {
    const response = await fileService.previewFile(props.file.id);
    previewUrl.value = URL.createObjectURL(response.data);
  } catch (err) {
    console.error("Preview file error:", err);
    error.value =
      err.response?.data?.message || "Failed to preview file";
  } finally {
    loading.value = false;
  }
};

const close = () => {
  clearPreview();
  error.value = "";
  emit("close");
};

watch(
  () => [props.open, props.file?.id],
  ([isOpen]) => {
    if (isOpen) {
      loadPreview();
    } else {
      clearPreview();
      error.value = "";
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearPreview();
});
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    @click.self="close"
    @keydown.esc="close"
  >
    <div
      class="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-gray-700"
      >
        <div class="min-w-0">
          <h3 class="truncate font-semibold text-gray-900 dark:text-white">
            {{ file?.originalName }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ file?.mimeType }}
          </p>
        </div>

        <button
          type="button"
          @click="close"
          class="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
        >
          <icon name="x" />
        </button>
      </div>

      <!-- Content -->
      <div
        class="flex min-h-[300px] flex-1 items-center justify-center overflow-auto bg-gray-100 p-4 dark:bg-gray-950"
      >
        <div v-if="loading" class="text-sm text-gray-500">
          Loading preview...
        </div>

        <div
          v-else-if="error"
          class="text-center text-sm text-red-500"
        >
          {{ error }}
        </div>

        <img
          v-else-if="previewUrl && isImage()"
          :src="previewUrl"
          :alt="file?.originalName"
          class="max-h-[75vh] max-w-full object-contain"
        />

        <iframe
          v-else-if="previewUrl && isPdf()"
          :src="previewUrl"
          class="h-[75vh] w-full rounded-lg bg-white"
          title="PDF Preview"
        />
      </div>
    </div>
  </div>
</template>
