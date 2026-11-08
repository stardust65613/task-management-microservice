
<script setup>
import { ref, watch } from "vue";
import { useProjectStore } from "@/stores/project.store";
import AddMember from "@/components/project/AddMember.vue";
import RemoveMember from "@/components/project/RemoveMember.vue";

const MEMBER_ROLES = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const projectStore = useProjectStore();

// Members
const roleDrafts = ref({});
const updatingMemberId = ref(null);
const memberError = ref("");
const memberSuccess = ref("");

// Add member
const showAddMemberModal = ref(false);

// Remove member
const showRemoveModal = ref(false);
const memberToRemove = ref(null);
const removing = ref(false);
const removeError = ref("");

function syncMemberRoles() {
  const drafts = {};

  for (const member of projectStore.members) {
    drafts[member.userId] = member.role;
  }

  roleDrafts.value = drafts;
}

async function loadMembers() {
  try {
    await projectStore.getMembers(props.project.id);
    syncMemberRoles();
  } catch (err) {
    memberError.value =
      err?.response?.data?.message ||
      "Failed to load project members.";
  }
}

// Load members when project changes
watch(
  () => props.project.id,
  loadMembers,
  { immediate: true }
);

// Update member role
async function updateMemberRole(member) {
  if (!member || updatingMemberId.value !== null) return;

  const projectId = props.project.id;
  const userId = member.userId;
  const newRole = roleDrafts.value[userId];

  if (!projectId || !userId) {
    memberError.value = "Missing project or member information.";
    return;
  }

  if (!MEMBER_ROLES.includes(newRole)) {
    memberError.value = "Invalid member role.";
    return;
  }

  if (newRole === member.role) return;

  updatingMemberId.value = userId;
  memberError.value = "";
  memberSuccess.value = "";

  try {
    const updatedMember = await projectStore.updateMember(
      projectId,
      userId,
      { role: newRole }
    );

    const index = projectStore.members.findIndex(
      (item) => item.userId === userId
    );

    if (index !== -1) {
      projectStore.members[index].role = updatedMember.role;
    }

    roleDrafts.value[userId] = updatedMember.role;

    memberSuccess.value =
      `Updated ${member.user.username}'s role successfully.`;

  } catch (err) {
    memberError.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update member role.";

    roleDrafts.value[userId] = member.role;

  } finally {
    updatingMemberId.value = null;
  }
}

function resetMemberMessages() {
  memberError.value = "";
  memberSuccess.value = "";
}

// Add member
function addMember() {
  showAddMemberModal.value = true;
}

function closeAddMemberModal() {
  showAddMemberModal.value = false;
}

async function handleMemberAdded() {
  try {
    await projectStore.getMembers(props.project.id);

    syncMemberRoles();
    resetMemberMessages();
  } catch (err) {
    memberError.value =
      err?.response?.data?.message ||
      "Failed to refresh project members.";
  }
}

// Remove member
function removeMember(member) {
  memberToRemove.value = member;
  removeError.value = "";
  showRemoveModal.value = true;
}

function closeRemoveModal() {
  if (removing.value) return;

  showRemoveModal.value = false;
  memberToRemove.value = null;
  removeError.value = "";
}

async function confirmRemoveMember() {
  if (!memberToRemove.value || removing.value) return;

  const projectId = props.project.id;
  const userId = memberToRemove.value.userId;

  if (!projectId || !userId) {
    removeError.value = "Missing project or member information.";
    return;
  }

  removing.value = true;
  removeError.value = "";

  try {
    await projectStore.removeMember(projectId, userId);

    const index = projectStore.members.findIndex(
      (member) => member.userId === userId
    );

    if (index !== -1) {
      projectStore.members.splice(index, 1);
    }

    delete roleDrafts.value[userId];

    showRemoveModal.value = false;
    memberToRemove.value = null;

  } catch (err) {
    removeError.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to remove member.";

  } finally {
    removing.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">

    <!-- Project Information -->
    <section
      class="rounded-xl border border-gray-200 bg-white p-6
             shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
        Project information
      </h2>

      <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <!-- Status -->
        <div>
          <p class="text-xs font-medium uppercase text-gray-500
                    dark:text-gray-400">
            Status
          </p>

          <span
            class="mt-2 inline-flex rounded-full bg-green-100
                   px-3 py-1 text-sm font-medium text-green-700
                   dark:bg-green-900/30 dark:text-green-400"
          >
            {{ project.status }}
          </span>
        </div>

        <!-- Visibility -->
        <div>
          <p class="text-xs font-medium uppercase text-gray-500
                    dark:text-gray-400">
            Visibility
          </p>

          <span
            class="mt-2 inline-flex rounded-full bg-blue-100
                   px-3 py-1 text-sm font-medium text-blue-700
                   dark:bg-blue-900/30 dark:text-blue-400"
          >
            {{ project.visibility }}
          </span>
        </div>

        <!-- Created -->
        <div>
          <p class="text-xs font-medium uppercase text-gray-500
                    dark:text-gray-400">
            Created
          </p>

          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {{
              project.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>

        <!-- Updated -->
        <div>
          <p class="text-xs font-medium uppercase text-gray-500
                    dark:text-gray-400">
            Last updated
          </p>

          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {{
              project.updatedAt
                ? new Date(project.updatedAt).toLocaleDateString()
                : "-"
            }}
          </p>
        </div>

      </div>
    </section>

    <!-- Members -->
    <section
      class="rounded-xl border border-gray-200 bg-white p-6
             shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >

      <!-- Header -->
      <div class="flex items-center justify-between gap-3">

        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
            Members
          </h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            People collaborating on this project
          </p>
        </div>

        <div class="flex items-center gap-3">

          <span
            class="rounded-full bg-gray-100 px-2.5 py-1 text-xs
                   font-medium text-gray-600 dark:bg-gray-800
                   dark:text-gray-400"
          >
            {{ projectStore.members?.length || 0 }}
          </span>

          <button
            type="button"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm
                   font-medium text-white transition hover:bg-blue-700"
            @click="addMember"
          >
            + Add Member
          </button>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="memberError"
        role="alert"
        class="mt-4 rounded-lg border border-red-200 bg-red-50
               px-4 py-3 text-sm text-red-600
               dark:border-red-900 dark:bg-red-950/30
               dark:text-red-400"
      >
        {{ memberError }}
      </div>

      <!-- Success -->
      <div
        v-if="memberSuccess"
        role="status"
        class="mt-4 rounded-lg border border-green-200 bg-green-50
               px-4 py-3 text-sm text-green-700
               dark:border-green-900 dark:bg-green-950/30
               dark:text-green-400"
      >
        {{ memberSuccess }}
      </div>

      <!-- Empty -->
      <div
        v-if="!projectStore.members?.length"
        class="mt-6 rounded-lg border border-dashed border-gray-300
               p-8 text-center dark:border-gray-700"
      >
        <div class="text-3xl">👥</div>

        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          No members in this project
        </p>
      </div>

      <!-- Member List -->
      <div
        v-else
        class="member-scrollbar mt-5 max-h-[440px] overflow-y-auto
               divide-y divide-gray-200 rounded-xl border
               border-gray-200 px-4 dark:divide-gray-700
               dark:border-gray-700"
      >
        <div
          v-for="member in projectStore.members"
          :key="member.id"
          class="flex flex-col gap-4 py-4 sm:flex-row
                 sm:items-center sm:justify-between"
        >

          <!-- User -->
          <div class="flex min-w-0 items-center gap-3">

            <img
              v-if="member.user.avatar"
              :src="member.user.avatar"
              :alt="member.user.username"
              class="h-10 w-10 shrink-0 rounded-full object-cover"
            />

            <div
              v-else
              class="flex h-10 w-10 shrink-0 items-center
                     justify-center rounded-full bg-blue-100
                     text-sm font-medium text-blue-600
                     dark:bg-blue-900/30 dark:text-blue-400"
            >
              {{
                (member.user.username || "?")
                  .charAt(0)
                  .toUpperCase()
              }}
            </div>

            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-gray-800 dark:text-white">
                {{ member.user.username }}
              </p>

              <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                {{ member.user.email }}
              </p>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Joined
                {{
                  member.joinedAt
                    ? new Date(member.joinedAt).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
          </div>

          <!-- Role Editing -->
          <div class="flex flex-wrap items-center gap-2">

            <select
              v-model="roleDrafts[member.userId]"
              class="min-w-32 rounded-lg border border-gray-300
                     bg-white px-3 py-2 text-sm text-gray-700
                     outline-none transition focus:border-blue-500
                     focus:ring-2 focus:ring-blue-100
                     disabled:cursor-not-allowed disabled:opacity-60
                     dark:border-gray-600 dark:bg-gray-800
                     dark:text-gray-200 dark:focus:ring-blue-900/40"
              :disabled="!!updatingMemberId || removing"
              @change="resetMemberMessages"
            >
              <option
                v-for="role in MEMBER_ROLES"
                :key="role"
                :value="role"
              >
                {{ role }}
              </option>
            </select>

            <button
              v-if="roleDrafts[member.userId] !== member.role"
              type="button"
              class="rounded-lg bg-blue-600 px-3 py-2 text-sm
                     font-medium text-white transition hover:bg-blue-700
                     disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!!updatingMemberId || removing"
              @click="updateMemberRole(member)"
            >
              {{
                updatingMemberId === member.userId
                  ? "Saving..."
                  : "Save"
              }}
            </button>

            <button
              type="button"
              class="rounded-lg border border-red-200 px-3 py-2
                     text-sm font-medium text-red-600 transition
                     hover:bg-red-50 dark:border-red-900
                     dark:text-red-400 dark:hover:bg-red-950/30"
              :disabled="!!updatingMemberId || removing"
              @click="removeMember(member)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Add Member Modal -->
    <AddMember
      v-if="showAddMemberModal"
      :project-id="project.id"
      @close="closeAddMemberModal"
      @added="handleMemberAdded"
    />

    <!-- Remove Member Modal -->
    <RemoveMember
      :member="memberToRemove"
      :removing="removing"
      :error="removeError"
      @close="closeRemoveModal"
      @confirm="confirmRemoveMember"
    />

  </div>
</template>

<style scoped>
.member-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.member-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 8px;
}

.member-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 8px;
}

.member-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark .member-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .member-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .member-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

.member-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.dark .member-scrollbar {
  scrollbar-color: #4b5563 #1f2937;
}
</style>
