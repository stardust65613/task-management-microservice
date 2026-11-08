<script setup>
defineProps({
  member: {
    type: Object,
    default: null,
  },
  removing: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "confirm"]);
</script>

<template>
  <div
    v-if="member"
    class="fixed inset-0 z-[60] flex items-center justify-center
           bg-black/50 p-4 backdrop-blur-sm"
    @click.self="!removing && emit('close')"
  >
    <div
      role="alertdialog"
      aria-modal="true"
      class="w-full max-w-md rounded-2xl border border-gray-200
             bg-white p-6 shadow-xl dark:border-gray-700
             dark:bg-gray-900"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        Remove member
      </h2>

      <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
        Are you sure you want to remove
        <strong>
          {{ member.user?.username || member.user?.email || member.username || member.email || "this member" }}
        </strong>
        from this project?
      </p>

      <p v-if="error" role="alert" class="mt-3 text-sm text-red-600">
        {{ error }}
      </p>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2
                 text-sm text-gray-700 hover:bg-gray-100
                 disabled:opacity-50 dark:border-gray-700
                 dark:text-gray-300 dark:hover:bg-gray-800"
          :disabled="removing"
          @click="emit('close')"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded-lg bg-red-600 px-4 py-2 text-sm
                 font-medium text-white hover:bg-red-700
                 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="removing"
          @click="emit('confirm')"
        >
          {{ removing ? "Removing..." : "Remove member" }}
        </button>
      </div>
    </div>
  </div>
</template>