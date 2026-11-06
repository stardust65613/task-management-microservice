import { defineStore } from "pinia";
import * as projectService from "@/services/project.service";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projects: [],
    collabProjects: [],
    currentProject: null,
    members: [],
    settings: null,
    loading: false,
  }),

  actions: {

    async getProjects() {
      this.loading = true;

      try {
        const res = await projectService.getUserProjects();

        this.projects = res.data.data;

        return res.data.data;
      } finally {
        this.loading = false;
      }
    },

    async getCollabProjects(userId) {
      const res = await projectService.getCollabProjects(userId);

      this.collabProjects = res.data.data;

      return res.data.data;
    },

    async getProject(id) {
      const res = await projectService.getProjectDetail(id);

      this.currentProject = res.data.data;

      return res.data.data;
    },

    async createProject(data) {
      const res = await projectService.createProject(data);

      const project = res.data.data;

      this.projects.push(project);

      return project;
    },

    async updateProject(id, data) {
      const res = await projectService.updateProject(id, data);

      const project = res.data.data;

      const index = this.projects.findIndex(
        (item) => item.id === id
      );

      if (index !== -1) {
        this.projects[index] = project;
      }

      if (this.currentProject?.id === id) {
        this.currentProject = project;
      }

      return project;
    },

    async deleteProject(id) {
      await projectService.deleteProject(id);

      this.projects = this.projects.filter(
        (item) => item.id !== id
      );

      if (this.currentProject?.id === id) {
        this.currentProject = null;
      }
    },

    async getMembers(projectId) {
      const res = await projectService.getProjectMembers(projectId);

      this.members = res.data.data;

      return res.data.data;
    },

    async addMember(projectId, data) {
      const res = await projectService.addMember(
        projectId,
        data
      );

      const member = res.data.data;

      return member;
    },

    async removeMember(projectId, userId) {
      await projectService.removeMember(
        projectId,
        userId
      );

      this.members = this.members.filter(
        (member) => member.userId !== userId
      );
    },

    async updateMember(projectId, userId, data) {
      const res = await projectService.updateMember(
        projectId,
        userId,
        data
      );

      const member = res.data.data;

      const index = this.members.findIndex(
        (item) => item.userId === userId
      );

      if (index !== -1) {
        this.members[index] = member;
      }

      return member;
    },


    async getSettings(projectId) {
      const res = await projectService.getProjectSetting(
        projectId
      );

      this.settings = res.data.data;

      return res.data.data;
    },

    async updateSettings(projectId, data) {
      const res = await projectService.updateProjectSetting(
        projectId,
        data
      );

      this.settings = res.data.data;

      return res.data.data;
    },
  },
});