<script setup>
import { computed, onMounted, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "@/stores/task.store";
import { useProjectStore } from "@/stores/project.store";
import * as fileService from "@/services/file.service";

const route = useRoute();
const router = useRouter();

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const taskId = computed(() => route.params.taskId ?? route.params.id);

const activeTab = ref("details");
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const success = ref("");

const attachments = ref([]);
const loadingAttachments = ref(false);
const uploading = ref(false);
const deletingFileId = ref(null);

const newComment = ref("");
const addingComment = ref(false);
const editingCommentId = ref(null);
const editingCommentContent = ref("");
const updatingComment = ref(false);
const deletingCommentId = ref(null);

const commentInput = ref(null);

const mentionQuery = ref(null);
const mentionStart = ref(-1);

const selectedMentions = ref([]);

const form = ref({
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  assigneeId: "",
});

const statuses = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "CANCELLED",
];

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const task = computed(() => taskStore.currentTask);
const members = computed(() => projectStore.members ?? []);
const comments = computed(() => taskStore.comments ?? []);

const isLocked = computed(() =>
  ["DONE", "CANCELLED"].includes(task.value?.status)
);

const formatDate = (date) => {
  if (!date) return "Not set";

  return new Date(date).toLocaleString("vi-VN");
};

const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getMimeLabel = (mimeType) => {
  if (!mimeType) return "Unknown";

  return mimeType.split("/").pop()?.toUpperCase() ?? "Unknown";
};

const syncForm = () => {
  if (!task.value) return;

  form.value = {
    title: task.value.title ?? "",
    description: task.value.description ?? "",
    status: task.value.status ?? "TODO",
    priority: task.value.priority ?? "MEDIUM",
    dueDate: task.value.dueDate
      ? new Date(task.value.dueDate).toISOString().slice(0, 10)
      : "",
    assigneeId: task.value.assigneeId ?? "",
  };
};

const loadAttachments = async () => {
  loadingAttachments.value = true;

  try {
    const data = await taskStore.getTaskAttachments(taskId.value);

    attachments.value = await Promise.all(
      (data ?? []).map(async (attachment) => {
        try {
          const response = await fileService.getFile(attachment.fileId);

          return {
            ...attachment,
            file: response.data.data,
          };
        } catch {
          return {
            ...attachment,
            file: null,
          };
        }
      })
    );
  } finally {
    loadingAttachments.value = false;
  }
};

const loadTaskDetail = async () => {
  loading.value = true;
  error.value = "";

  try {
    await taskStore.getTaskDetail(taskId.value);

    if (!task.value) {
      throw new Error("Task not found");
    }

    syncForm();

    if (task.value.projectId) {
      await projectStore.getMembers(task.value.projectId);
    }

    await Promise.all([
      loadAttachments(),
      taskStore.getCommentsByTask(taskId.value),
    ]);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to load task";
  } finally {
    loading.value = false;
  }
};

const saveTask = async () => {
  if (isLocked.value || saving.value) return;

  error.value = "";
  success.value = "";

  if (!form.value.title.trim()) {
    error.value = "Task title is required";
    return;
  }

  saving.value = true;

  try {
    const originalAssigneeId = task.value.assigneeId ?? "";
    const newAssigneeId = form.value.assigneeId || null;

    await taskStore.updateTask(taskId.value, {
      title: form.value.title.trim(),
      description: form.value.description.trim() || null,
      status: form.value.status,
      priority: form.value.priority,
      dueDate: form.value.dueDate || null,
    });

    if (originalAssigneeId !== (newAssigneeId ?? "")) {
      await taskStore.assignTask(taskId.value, {
        assigneeId: newAssigneeId,
      });
    }

    syncForm();
    success.value = "Task updated successfully";
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to update task";
  } finally {
    saving.value = false;
  }
};

const uploadAttachments = async (event) => {
  const files = Array.from(event.target.files ?? []);

  if (!files.length || isLocked.value) return;

  uploading.value = true;
  error.value = "";
  success.value = "";

  try {
    for (const file of files) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", "ATTACHMENT");

      // Upload file to file service
      const response = await fileService.uploadFile(formData);
      const fileId = response.data.data.id;

      // Link uploaded file to task
      await taskStore.attachFileToTask(taskId.value, { fileId });
    }

    await loadAttachments();
    success.value = "File(s) uploaded successfully";
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to upload file";
    await loadAttachments();
  } finally {
    uploading.value = false;
    event.target.value = "";
  }
};

const downloadAttachment = async (attachment) => {
  try {
    const response = await fileService.downloadFile(
      attachment.fileId
    );

    const blob = new Blob([response.data], {
      type: attachment.file?.mimeType || "application/octet-stream",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      attachment.file?.originalName || "download";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to download file";
  }
};

const removeAttachment = async (attachment) => {
  if (!confirm("Remove this attachment from the task?")) return;

  deletingFileId.value = attachment.fileId;
  error.value = "";

  try {
    await taskStore.removeFileFromTask(
      taskId.value,
      attachment.fileId
    );

    // Reload because the store's local filter may use attachment.id
    await loadAttachments();

    success.value = "Attachment removed successfully";
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to remove attachment";
  } finally {
    deletingFileId.value = null;
  }
};

const filteredMembers = computed(() => {
  if (mentionQuery.value === null) return [];

  const query = mentionQuery.value.toLowerCase();

  return projectStore.members.filter((member) => {
    const username = member.user?.username ?? "";

    return username.toLowerCase().includes(query);
  });
});

const handleCommentInput = (event) => {
  const textarea = event.target;
  const cursor = textarea.selectionStart;
  const textBeforeCursor = newComment.value.slice(0, cursor);

  const match = textBeforeCursor.match(/(?:^|\s)@([^\s@]*)$/);

  if (!match) {
    mentionQuery.value = null;
    mentionStart.value = -1;
    return;
  }

  mentionQuery.value = match[1];
  mentionStart.value = cursor - match[1].length - 1;
};

const selectMention = async (member) => {
  const username = member.user.username;
  const userId = member.userId;

  const before = newComment.value.slice(0, mentionStart.value);
  const after = newComment.value.slice(
    commentInput.value.selectionStart
  );

  const mentionText = `@${username} `;

  newComment.value = before + mentionText + after;

  // Không thêm trùng userId
  if (!selectedMentions.value.some((id) => id === userId)) {
    selectedMentions.value.push({
      userId,
      username,
    });
  }

  mentionQuery.value = null;
  mentionStart.value = -1;

  await nextTick();

  commentInput.value?.focus();

  const cursor = (before + mentionText).length;

  commentInput.value?.setSelectionRange(cursor, cursor);
};

const addComment = async () => {
  const content = newComment.value.trim();

  if (!content || addingComment.value) return;

  addingComment.value = true;
  error.value = "";

  try {
    // Chỉ lấy những mentions vẫn còn xuất hiện trong nội dung
    const mentions = selectedMentions.value
      .filter((item) => content.includes(`@${item.username}`))
      .map((item) => item.userId);

    await taskStore.addComment(taskId.value, {
      content,
      projectId: task.value.projectId,
      mentions,
    });

    newComment.value = "";
    selectedMentions.value = [];

    await taskStore.getCommentsByTask(taskId.value);
  } catch (err) {
    console.error("Add comment error:", err);

    error.value =
      err.response?.data?.message || "Failed to add comment";
  } finally {
    addingComment.value = false;
  }
};

const startEditComment = (comment) => {
  editingCommentId.value = comment.id ?? comment._id;
  editingCommentContent.value = comment.content ?? "";
};

const cancelEditComment = () => {
  editingCommentId.value = null;
  editingCommentContent.value = "";
};

const saveComment = async (commentId) => {
  const content = editingCommentContent.value.trim();

  if (!content || updatingComment.value) return;

  updatingComment.value = true;
  error.value = "";

  try {
    await taskStore.updateComment(commentId, { content });

    cancelEditComment();
    await taskStore.getCommentsByTask(taskId.value);
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to update comment";
  } finally {
    updatingComment.value = false;
  }
};

const removeComment = async (commentId) => {
  if (!confirm("Delete this comment?")) return;

  deletingCommentId.value = commentId;
  error.value = "";

  try {
    await taskStore.deleteComment(commentId);
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to delete comment";
  } finally {
    deletingCommentId.value = null;
  }
};

onMounted(loadTaskDetail);
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6">
    <div class="mx-auto max-w-5xl space-y-6">

      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            class="mb-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white"
            @click="router.back()"
          >
            ← Back
          </button>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Task Detail
          </h1>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage task information
          </p>
        </div>

        <span
          v-if="task"
          class="rounded-full px-3 py-1 text-sm font-medium"
          :class="{
            'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300':
              task.status === 'DONE',
            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300':
              task.status === 'CANCELLED',
            'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300':
              !['DONE', 'CANCELLED'].includes(task.status),
          }"
        >
          {{ task.status }}
        </span>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900"
      >
        Loading task...
      </div>

      <template v-else-if="task">

        <!-- Alerts -->
        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
        >
          {{ success }}
        </div>

        <div
          v-if="isLocked"
          class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
        >
          This task is {{ task.status.toLowerCase() }} and can no longer be edited.
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="tab in [
              { id: 'details', label: 'Details' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'comments', label: 'Comments' },
            ]"
            :key="tab.id"
            class="whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition"
            :class="
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            "
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span
              v-if="tab.id === 'attachments'"
              class="ml-1 text-xs"
            >
              ({{ attachments.length }})
            </span>
            <span
              v-if="tab.id === 'comments'"
              class="ml-1 text-xs"
            >
              ({{ comments.length }})
            </span>
          </button>
        </div>

        <!-- DETAILS TAB -->
        <section
          v-if="activeTab === 'details'"
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
        >
          <form class="space-y-5" @submit.prevent="saveTask">

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                :disabled="isLocked"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-800"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                :disabled="isLocked"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-800"
              ></textarea>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  v-model="form.status"
                  :disabled="isLocked"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option
                    v-for="status in statuses"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <select
                  v-model="form.priority"
                  :disabled="isLocked"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option
                    v-for="priority in priorities"
                    :key="priority"
                    :value="priority"
                  >
                    {{ priority }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assignee
                </label>
                <select
                  v-model="form.assigneeId"
                  :disabled="isLocked"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Unassigned</option>
                  <option
                    v-for="member in members"
                    :key="member.userId"
                    :value="member.userId"
                  >
                    {{ member.user?.username || member.user?.email }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due date
                </label>
                <input
                  v-model="form.dueDate"
                  type="date"
                  :disabled="isLocked"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div class="grid gap-4 border-t border-gray-200 pt-4 text-sm dark:border-gray-700 sm:grid-cols-2">
              <div>
                <p class="text-gray-500 dark:text-gray-400">Created at</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">
                  {{ formatDate(task.createdAt) }}
                </p>
              </div>

              <div>
                <p class="text-gray-500 dark:text-gray-400">Last updated</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">
                  {{ formatDate(task.updatedAt) }}
                </p>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                v-if="!isLocked"
                type="submit"
                :disabled="saving"
                class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ saving ? "Saving..." : "Save changes" }}
              </button>
            </div>
          </form>
        </section>

        <!-- ATTACHMENTS TAB -->
        <section
          v-if="activeTab === 'attachments'"
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
        >
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">
                Attachments
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Files attached to this task
              </p>
            </div>

            <label
              v-if="!isLocked"
              class="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {{ uploading ? "Uploading..." : "Upload files" }}
              <input
                type="file"
                multiple
                class="hidden"
                :disabled="uploading"
                @change="uploadAttachments"
              />
            </label>
          </div>

          <div
            v-if="loadingAttachments"
            class="py-8 text-center text-sm text-gray-500"
          >
            Loading attachments...
          </div>

          <div
            v-else-if="attachments.length === 0"
            class="rounded-lg border border-dashed border-gray-300 py-10 text-center dark:border-gray-700"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No attachments yet
            </p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="attachment in attachments"
              :key="attachment.id"
              class="flex flex-wrap items-center gap-3 py-4"
            >
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.5 6.5 9 13a3 3 0 0 0 4.2 4.2l6-6a5 5 0 0 0-7.1-7.1l-7 7a7 7 0 0 0 9.9 9.9l5-5"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {{ attachment.file?.originalName || "File information unavailable" }}
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ getMimeLabel(attachment.file?.mimeType) }}
                  ·
                  {{ formatBytes(attachment.file?.size) }}
                  ·
                  {{ formatDate(attachment.createdAt) }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="downloadAttachment(attachment)"
                >
                  Download
                </button>

                <button
                  v-if="!isLocked"
                  type="button"
                  :disabled="deletingFileId === attachment.fileId"
                  class="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/40"
                  @click="removeAttachment(attachment)"
                >
                  {{ deletingFileId === attachment.fileId ? "Removing..." : "Remove" }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- COMMENTS TAB -->
        <section
          v-if="activeTab === 'comments'"
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
        >
          <h2 class="mb-5 font-semibold text-gray-900 dark:text-white">
            Comments
          </h2>

          <!-- Add comment -->
          <form class="mb-6 space-y-3" @submit.prevent="addComment">
            <div class="relative">
              <textarea
                ref="commentInput"
                v-model="newComment"
                @input="handleCommentInput"
                rows="3"
                placeholder="Write a comment... Use @ to mention someone"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              ></textarea>

              <!-- Mention dropdown -->
              <div
                v-if="mentionQuery !== null"
                class="absolute bottom-full left-0 z-50 mb-2 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  v-for="member in filteredMembers"
                  :key="member.userId"
                  type="button"
                  @mousedown.prevent="selectMention(member)"
                  class="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <img
                    v-if="member.user?.avatar"
                    :src="member.user.avatar"
                    class="h-8 w-8 rounded-full object-cover"
                    alt=""
                  />

                  <div>
                    <p class="text-sm font-medium text-gray-800 dark:text-white">
                      {{ member.user?.username }}
                    </p>

                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ member.user?.email }}
                    </p>
                  </div>
                </button>

                <p
                  v-if="filteredMembers.length === 0"
                  class="p-3 text-sm text-gray-500"
                >
                  No members found
                </p>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="addingComment || !newComment.trim()"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ addingComment ? "Posting..." : "Post comment" }}
              </button>
            </div>
          </form>

          <div
            v-if="comments.length === 0"
            class="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            No comments yet
          </div>

          <div v-else class="space-y-4">
            <article
              v-for="comment in comments"
              :key="comment.id ?? comment._id"
              class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{
                      comment.user?.username ||
                      comment.author?.username ||
                      comment.username ||
                      "User"
                    }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(comment.createdAt) }}
                    <span v-if="comment.updatedAt !== comment.createdAt">
                      · Edited
                    </span>
                  </p>
                </div>

                <div
                  v-if="editingCommentId !== (comment.id ?? comment._id)"
                  class="flex gap-2"
                >
                  <button
                    type="button"
                    class="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                    @click="startEditComment(comment)"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    :disabled="deletingCommentId === (comment.id ?? comment._id)"
                    class="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                    @click="removeComment(comment.id ?? comment._id)"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div v-if="editingCommentId === (comment.id ?? comment._id)">
                <textarea
                  v-model="editingCommentContent"
                  rows="3"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                </textarea>

                <div class="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg border border-gray-300 px-3 py-2 text-xs dark:border-gray-600 dark:text-gray-300"
                    @click="cancelEditComment"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    :disabled="updatingComment || !editingCommentContent.trim()"
                    class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                    @click="saveComment(comment.id ?? comment._id)"
                  >
                    {{ updatingComment ? "Saving..." : "Save" }}
                  </button>
                </div>
              </div>

              <p
                v-else
                class="whitespace-pre-wrap break-words text-sm text-gray-700 dark:text-gray-300"
              >
                {{ comment.content }}
              </p>
            </article>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
