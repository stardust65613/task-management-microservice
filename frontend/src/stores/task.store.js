import { defineStore } from "pinia";
import * as taskService from "@/services/task.service";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    loading: false,
  }),

  actions: {
    async getTasksByProject(projectId) {
      this.loading = true;

      try {
        const res = await taskService.getTasksByProject(projectId);

        this.tasks = res.data.data;

        return res.data.data;
      } finally {
        this.loading = false;
      }
    },
  },
});