<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "close",
  "add-member",
  "edit-member",
  "remove-member",
]);

const memberCount = computed(() => props.members.length);

const activeMemberId = ref(null);

function toggleMemberMenu(member) {
  activeMemberId.value =
    activeMemberId.value === member.id ? null : member.id;
}

function editMember(member) {
  activeMemberId.value = null;
  emit("edit-member", member);
}

function removeMember(member) {
  activeMemberId.value = null;
  emit("remove-member", member);
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center
           bg-black/50 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="members-title"
      class="w-full max-w-2xl overflow-hidden rounded-2xl
             border border-gray-200 bg-white shadow-xl
             dark:border-gray-700 dark:bg-gray-900"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b
               border-gray-200 px-6 py-5
               dark:border-gray-700"
      >
        <div>
          <h2
            id="members-title"
            class="text-xl font-semibold text-gray-800
                   dark:text-white"
          >
            Project Members
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ memberCount }} member(s) in this project
          </p>
        </div>

        <button
          type="button"
          aria-label="Close modal"
          class="rounded-lg p-2 text-gray-500
                 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Toolbar -->
      <div class="flex justify-end border-b border-gray-200
                  px-6 py-4 dark:border-gray-700">
        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2
                 text-sm font-medium text-white
                 hover:bg-blue-700"
          @click="emit('add-member')"
        >
          + Add Member
        </button>
      </div>

      <!-- Member list -->
      <div class="max-h-96 overflow-y-auto p-6">
        <div
          v-if="members.length === 0"
          class="py-10 text-center text-sm text-gray-500
                 dark:text-gray-400"
        >
          No members in this project.
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
          >
            <!-- Avatar -->
            <img
              v-if="member.avatarUrl"
              :src="member.avatarUrl"
              :alt="member.username || member.name || member.email"
              class="h-10 w-10 rounded-full object-cover"
            />

            <div
              v-else
              class="flex h-10 w-10 shrink-0 items-center
                     justify-center rounded-full bg-blue-100
                     font-semibold text-blue-600
                     dark:bg-blue-900/30 dark:text-blue-400"
            >
              {{
                (member.username || member.name || member.email || "?")
                  .charAt(0)
                  .toUpperCase()
              }}
            </div>

            <!-- Information -->
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium
                        text-gray-800 dark:text-white">
                {{ member.username || member.name || "User" }}
              </p>

              <p class="truncate text-sm text-gray-500
                        dark:text-gray-400">
                {{ member.email }}
              </p>
            </div>

            <!-- Role -->
            <span
              v-if="member.role"
              class="rounded-full bg-gray-100 px-2.5 py-1
                     text-xs font-medium text-gray-600
                     dark:bg-gray-800 dark:text-gray-300"
            >
              {{ member.role }}
            </span>

            <!-- Actions -->
            <div class="relative">
              <button
                type="button"
                aria-label="Manage member"
                class="rounded-lg px-3 py-2 text-gray-500
                    hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="toggleMemberMenu(member)"
              >
                ⋮
              </button>

              <div
                v-if="activeMemberId === member.id"
                class="absolute right-0 top-full z-20 mt-1 w-40
                        rounded-lg border border-gray-200 bg-white
                        py-1 shadow-lg dark:border-gray-700
                        dark:bg-gray-800"
                >
                <button
                  type="button"
                  class="w-full px-4 py-2 text-left text-sm
                            text-gray-700 hover:bg-gray-100
                            dark:text-gray-200 dark:hover:bg-gray-700"
                  @click="editMember(member)"
                >
                    Edit member
                </button>

                <button
                  type="button"
                  class="w-full px-4 py-2 text-left text-sm
                            text-red-600 hover:bg-red-50
                            dark:hover:bg-red-950/30"
                  @click="removeMember(member)"
                >
                    Remove member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-end border-t border-gray-200
               bg-gray-50 px-6 py-4
               dark:border-gray-700 dark:bg-gray-900"
      >
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium
                 text-gray-600 hover:bg-gray-200
                 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
