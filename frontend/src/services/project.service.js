import api from "@/api/axios";

const BASE_URL = "/projects";

// Project
export function createProject(data) {
  return api.post(`${BASE_URL}/create`, data);
}

export function getUserProjects() {
  return api.get(`${BASE_URL}/list`);
}

export function getCollabProjects(userId) {
  return api.get(`${BASE_URL}/shared`);
}

export function updateProject(id, data) {
  return api.put(`${BASE_URL}/${id}`, data);
}

export function getProjectDetail(id) {
  return api.get(`${BASE_URL}/${id}`);
}

export function deleteProject(id) {
  return api.delete(`${BASE_URL}/${id}`);
}

// Members
export function addMember(projectId, data) {
  return api.post(`${BASE_URL}/${projectId}/members`, data);
}

export function removeMember(projectId, userId) {
  return api.delete(`${BASE_URL}/${projectId}/members/${userId}`);
}

export function getProjectMembers(projectId) {
  return api.get(`${BASE_URL}/${projectId}/members`);
}

export function updateMember(projectId, userId, data) {
  return api.patch(
    `${BASE_URL}/${projectId}/members/${userId}`,
    data
  );
}

// Settings
export function getProjectSetting(projectId) {
  return api.get(`${BASE_URL}/${projectId}/settings`);
}

export function updateProjectSetting(projectId, data) {
  return api.patch(
    `${BASE_URL}/${projectId}/settings`,
    data
  );
}