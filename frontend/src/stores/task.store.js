
import { defineStore } from "pinia";
import * as taskService from "@/services/task.service";
import * as fileService from "@/services/file.service";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    currentTask: null,

    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },

    statistics: null,
    attachments: [],
    comments: [],
    mentions: [],

    loading: false,
    loadingProjectTasks: false,
  }),

  actions: {
    // ==================== TASKS ====================

    async createTask(projectId, data) {
      const response = await taskService.createTask(projectId, data);
      return response.data.data;
    },

    async getTasksByProject(projectId, page = 1, limit = 10) {
      try {
        this.loading = true;

        const response = await taskService.getTasksByProject(
          projectId,
          page,
          limit
        );

        const data = response.data.data;

        this.tasks = data.tasks;
        this.pagination = data.pagination;

        return data;
      } finally {
        this.loading = false;
      }
    },

    async searchTasks(projectId, params = {}) {
      try {
        this.loading = true;

        const response = await taskService.searchTasks(projectId, params);
        const data = response.data.data;

        this.tasks = data.tasks ?? data;
        if (data.pagination) {
          this.pagination = data.pagination;
        }

        return data;
      } finally {
        this.loading = false;
      }
    },

    async getTasksByAssignee(projectId, userId) {
      try {
        this.loading = true;

        const response = await taskService.getTasksByAssignee(
          projectId,
          userId
        );

        const data = response.data.data;
        this.tasks = data.tasks ?? data;

        return data;
      } finally {
        this.loading = false;
      }
    },

    async getMyTasks(params = {}) {
      try {
        this.loading = true;

        const response = await taskService.getMyTasks(params);
        const data = response.data.data;

        this.tasks = data.tasks ?? data;
        if (data.pagination) {
          this.pagination = data.pagination;
        }

        return data;
      } finally {
        this.loading = false;
      }
    },

    async getOverdueTasks(projectId) {
      try {
        this.loading = true;

        const response = await taskService.getOverdueTasks(projectId);
        const data = response.data.data;

        this.tasks = data.tasks ?? data;

        return data;
      } finally {
        this.loading = false;
      }
    },

    async getTasksStatistics(projectId) {
      const response = await taskService.getTasksStatistics(projectId);

      this.statistics = response.data.data;
      return this.statistics;
    },

    async getTaskDetail(taskId) {
      const response = await taskService.getTaskDetail(taskId);

      this.currentTask = response.data.data;
      return this.currentTask;
    },

    async updateTask(taskId, data) {
      const response = await taskService.updateTask(taskId, data);
      const updatedTask = response.data.data;

      if (updatedTask) {
        const updatedId = updatedTask.id ?? updatedTask._id;

        this.tasks = this.tasks.map((task) =>
          (task.id ?? task._id) === updatedId ? updatedTask : task
        );

        if (
          (this.currentTask?.id ?? this.currentTask?._id) === updatedId
        ) {
          this.currentTask = updatedTask;
        }
      }

      return updatedTask;
    },

    async assignTask(taskId, data) {
      const response = await taskService.assignTask(taskId, data);
      const updatedTask = response.data.data;

      if (updatedTask) {
        const updatedId = updatedTask.id ?? updatedTask._id;

        this.tasks = this.tasks.map((task) =>
          (task.id ?? task._id) === updatedId ? updatedTask : task
        );

        if (
          (this.currentTask?.id ?? this.currentTask?._id) === updatedId
        ) {
          this.currentTask = updatedTask;
        }
      }

      return updatedTask;
    },

    async deleteTask(taskId) {
      await taskService.deleteTask(taskId);

      this.tasks = this.tasks.filter(
        (task) => (task.id ?? task._id) !== taskId
      );

      if (
        (this.currentTask?.id ?? this.currentTask?._id) === taskId
      ) {
        this.currentTask = null;
      }

      this.pagination.total = Math.max(0, this.pagination.total - 1);
    },

    async completeTask(taskId) {
      const response = await taskService.completeTask(taskId);
      const updatedTask = response.data.data;

      if (updatedTask) {
        const updatedId = updatedTask.id ?? updatedTask._id;

        this.tasks = this.tasks.map((task) =>
          (task.id ?? task._id) === updatedId ? updatedTask : task
        );

        if (
          (this.currentTask?.id ?? this.currentTask?._id) === updatedId
        ) {
          this.currentTask = updatedTask;
        }
      }

      return updatedTask;
    },

    async getAllTasksByProject(projectId) {
      try {
        this.loadingProjectTasks = true;

        const response = await taskService.getAllTasksByProject(projectId);
        const data = response.data.data;

        this.tasks = Array.isArray(data) ? data : data.tasks ?? [];

        return this.tasks;
      } finally {
        this.loadingProjectTasks = false;
      }
    },

    // ==================== ATTACHMENTS ====================

    async attachFileToTask(taskId, data) {
      const response = await taskService.attachFileToTask(taskId, data);
      return response.data.data;
    },

    async uploadAttachment(taskId, file) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", "ATTACHMENT");

      const uploadResponse = await fileService.uploadFile(formData);
      const fileId = uploadResponse.data.data.id;

      return await this.attachFileToTask(taskId, { fileId });
    },

    async getTaskAttachments(taskId) {
      const response = await taskService.getTaskAttachments(taskId);

      this.attachments = response.data.data;
      return this.attachments;
    },

    async getTaskAttachmentsWithDetails(taskId) {
      const attachments = await this.getTaskAttachments(taskId);

      return await Promise.all(
        attachments.map(async (attachment) => {
          const response = await fileService.getFile(attachment.fileId);

          return {
            ...attachment,
            file: response.data.data,
          };
        })
      );
    },

    async removeFileFromTask(taskId, fileId) {
      await taskService.removeFileFromTask(taskId, fileId);

      this.attachments = this.attachments.filter(
        (file) => (file.id ?? file._id) !== fileId
      );
    },

    // ==================== COMMENTS ====================

    async addComment(taskId, data) {
      const response = await taskService.addComment(taskId, data);
      return response.data.data;
    },

    async getCommentsByTask(taskId) {
      const response = await taskService.getCommentsByTask(taskId);
      const data = response.data.data;

      this.comments = data.comments ?? data;
      return data;
    },

    async getMyMentions() {
      const response = await taskService.getMyMentions();
      const data = response.data.data;

      this.mentions = data.mentions ?? data;
      return data;
    },

    async getComment(commentId) {
      const response = await taskService.getComment(commentId);
      return response.data.data;
    },

    async updateComment(commentId, data) {
      const response = await taskService.updateComment(commentId, data);
      const updatedComment = response.data.data;

      this.comments = this.comments.map((comment) =>
        (comment.id ?? comment._id) === commentId
          ? updatedComment
          : comment
      );

      return updatedComment;
    },

    async deleteComment(commentId) {
      await taskService.deleteComment(commentId);

      this.comments = this.comments.filter(
        (comment) => (comment.id ?? comment._id) !== commentId
      );
    },
  },
});
