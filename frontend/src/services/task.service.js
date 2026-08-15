import api from "@/api/axios";

export function getTasksByProject(projectId) {
  return api.get(`/projects/${projectId}/tasks`);
}