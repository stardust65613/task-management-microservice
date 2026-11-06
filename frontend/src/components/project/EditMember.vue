<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  member: {
    type: Object,
    default: null,
  },
  updating: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "save"]);

const editRole = ref("");

watch(
  () => props.member,
  (member) => {
    editRole.value = member?.role ?? "";
  },
  { immediate: true }
);

function saveChanges() {
  if (!editRole.value.trim() || props.updating) return;

  emit("save", {
    role: editRole.value.trim(),
  });
}
</script>

<template>
  <div
    v-if="member"
    class="fixed inset-0 z-[60] flex items-center justify-center
           bg-black/50 p-4 backdrop-blur-sm"
    @click.self="!updating && emit('close')"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-member-title"
      class="w-full max-w-md rounded-2xl border border-gray-200
             bg-white p-6 shadow-xl dark:border-gray-700
             dark:bg-gray-900"
    >
      <h2
        id="edit-member-title"
        class="text-lg font-semibold text-gray-900 dark:text-white"
      >
        Edit member
      </h2>

      <div class="mt-5 space-y-4">
        <div>
          <label
            for="member-username"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Username
          </label>

          <input
            id="member-username"
            :value="member.user?.username || member.username || ''"
            type="text"
            readonly
            class="mt-1 w-full rounded-lg border border-gray-300
                   bg-gray-100 px-3 py-2 text-sm text-gray-600
                   dark:border-gray-700 dark:bg-gray-800
                   dark:text-gray-400"
          />
        </div>

        <div>
          <label
            for="member-email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>

          <input
            id="member-email"
            :value="member.user?.email || member.email || ''"
            type="email"
            readonly
            class="mt-1 w-full rounded-lg border border-gray-300
                   bg-gray-100 px-3 py-2 text-sm text-gray-600
                   dark:border-gray-700 dark:bg-gray-800
                   dark:text-gray-400"
          />
        </div>

        <div>
          <label
            for="member-role"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Project role
          </label>

          <input
            id="member-role"
            v-model="editRole"
            type="text"
            required
            class="mt-1 w-full rounded-lg border border-gray-300
                   bg-white px-3 py-2 text-sm text-gray-800
                   outline-none focus:border-blue-500
                   dark:border-gray-700 dark:bg-gray-800
                   dark:text-white"
          />
        </div>
      </div>

      <p v-if="error" role="alert" class="mt-3 text-sm text-red-600">
        {{ error }}
      </p>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm text-gray-600
                 hover:bg-gray-100 disabled:opacity-50
                 dark:text-gray-300 dark:hover:bg-gray-800"
          :disabled="updating"
          @click="emit('close')"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm
                 font-medium text-white hover:bg-blue-700
                 disabled:opacity-60"
          :disabled="updating || !editRole.trim()"
          @click="saveChanges"
        >
          {{ updating ? "Saving..." : "Save changes" }}
        </button>
      </div>
    </div>
  </div>
</template>
