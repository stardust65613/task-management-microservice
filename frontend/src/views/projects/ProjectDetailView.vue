<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project.store";
import TaskList from "@/components/task/TaskList.vue";
import AddMember from "@/components/project/AddMember.vue";
import RemoveMember from "@/components/project/RemoveMember.vue";

const MEMBER_ROLES = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const loading = ref(true);
const error = ref("");
const project = ref(null);

const showAddMemberModal = ref(false);

// Member role editing
const roleDrafts = ref({});
const updatingMemberId = ref(null);
const memberError = ref("");
const memberSuccess = ref("");

// Remove member
const showRemoveModal = ref(false);
const memberToRemove = ref(null);
const removing = ref(false);
const removeError = ref("");

// Delete project
const deleting = ref(false);
const deleteError = ref("");

function syncMemberRoles() {
  const drafts = {};

  for (const member of projectStore.members) {
    drafts[member.userId] = member.role;
  }

  roleDrafts.value = drafts;
}

async function updateMemberRole(member) {
  if (!member || updatingMemberId.value !== null) return;

  const projectId = project.value?.id;
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

function addMember() {
  showAddMemberModal.value = true;
}

function closeAddMemberModal() {
  showAddMemberModal.value = false;
}

async function handleMemberAdded() {
  try {
    await projectStore.getMembers(project.value.id);

    syncMemberRoles();
    resetMemberMessages();
  } catch (error) {
    memberError.value =
      error?.response?.data?.message ||
      "Failed to refresh project members.";
  }
}

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

  const projectId = project.value?.id;
  const userId = memberToRemove.value.userId;

  if (!projectId || !userId) {
    removeError.value = "Missing project or member information.";
    return;
  }

  removing.value = true;
  removeError.value = "";

  try {
    await projectStore.removeMember(projectId, userId);

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

onMounted(async () => {
  try {
    loading.value = true;
    error.value = "";

    project.value = await projectStore.getProject(route.params.id);

    await projectStore.getMembers(route.params.id);

    syncMemberRoles();
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      "Failed to load project.";
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.push("/projects");
}

function editProject() {
  router.push(`/projects/${route.params.id}/edit`);
}

function projectSettings() {
  router.push(`/projects/${route.params.id}/settings`);
}

function viewAllTasks() {
  router.push(`/projects/${route.params.id}/tasks`);
}

function createTask() {
  router.push(`/projects/${route.params.id}/tasks/create`);
}
</script>

<template>
  <div class="space-y-6">

    <!-- Back -->
    <button
      type="button"
      class="flex items-center gap-2 text-sm text-gray-500 transition
             hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
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

    <!-- Project -->
    <template v-else-if="project">

      <!-- Project Header -->
      <section
        class="flex flex-col gap-4 rounded-xl border border-gray-200
               bg-white p-6 shadow-sm dark:border-gray-700
               dark:bg-gray-900 sm:flex-row sm:items-center
               sm:justify-between"
      >
        <!-- Project info -->
        <div class="flex items-center gap-4">

          <div
            class="flex h-14 w-14 shrink-0 items-center justify-center
                   rounded-xl bg-blue-100 text-3xl dark:bg-blue-900/30"
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

        <!-- Role update error -->
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

        <!-- Role update success -->
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

        <!-- No members -->
        <div
          v-if="!projectStore.members?.length"
          class="mt-6 rounded-lg border border-dashed border-gray-300
                 p-8 text-center dark:border-gray-700"
        >
          <div class="text-3xl">
            👥
          </div>

          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
            No members in this project
          </p>
        </div>

        <!-- Member list -->
        <div
          v-else
          class="member-scrollbar mt-5 max-h-[440px] overflow-y-auto
                divide-y divide-gray-200 rounded-xl
                border border-gray-200 px-4
                dark:divide-gray-700 dark:border-gray-700"
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

            <!-- Role editing -->
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
                :disabled="!!updatingMemberId"
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
                :disabled="!!updatingMemberId"
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
      
      <!-- Tasks -->
      <section
        class="rounded-xl border border-gray-200 bg-white p-6
               shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >

        <!-- Header -->
        <div class="mb-5 flex items-center justify-between gap-3">

          <div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
              Tasks
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tasks in this project
            </p>
          </div>

          <div class="flex items-center gap-2">

            <button
              type="button"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm
                     font-medium text-white transition hover:bg-blue-700"
              @click="createTask"
            >
              + New Task
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-lg
                     px-3 py-2 text-sm font-medium text-blue-600
                     transition hover:bg-blue-50 hover:text-blue-700
                     dark:text-blue-400 dark:hover:bg-blue-900/30"
              @click="viewAllTasks"
            >
              View all
              <span>→</span>
            </button>
          </div>
        </div>

        <TaskList
          :project-id="route.params.id"
          :limit="5"
        />
      </section>

    </template>

    <!-- Add Member Modal -->
    <AddMember
      v-if="showAddMemberModal"
      :project-id="project?.id"
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
/* Light mode */
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

/* Dark mode */
.dark .member-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .member-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .member-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Firefox */
.member-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.dark .member-scrollbar {
  scrollbar-color: #4b5563 #1f2937;
}
</style>