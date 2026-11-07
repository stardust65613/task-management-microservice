
import api from "@/api/axios";

// ==================== TASKS ====================

// Create task
export function createTask(projectId, data) {
  return api.post(`/projects/${projectId}/tasks`, data);
}

// Get tasks by project (pagination)
export function getTasksByProject(projectId, page = 1, limit = 10) {
  return api.get(`/projects/${projectId}/tasks`, {
    params: { page, limit },
  });
}

export function getAllTasksByProject(projectId) {
  return api.get(
    `/projects/${projectId}/all`
  );
};

// Search tasks in project
export function searchTasks(projectId, params = {}) {
  return api.get(`/projects/${projectId}/tasks/search`, {
    params,
  });
}

// Get tasks assigned to a user in a project
export function getTasksByAssignee(projectId, userId) {
  return api.get(
    `/projects/${projectId}/tasks/assignee/${userId}`
  );
}

// Get my tasks
export function getMyTasks(params = {}) {
  return api.get("/tasks/my", { params });
}

// Get overdue tasks in a project
export function getOverdueTasks(projectId) {
  return api.get(`/tasks/overdue/${projectId}`);
}

// Get task statistics for a project
export function getTasksStatistics(projectId) {
  return api.get(`/projects/${projectId}/tasks/statistics`);
}

// Get task detail
export function getTaskDetail(taskId) {
  return api.get(`/tasks/${taskId}`);
}

// Update task
export function updateTask(taskId, data) {
  return api.patch(`/tasks/${taskId}`, data);
}

// Assign task to a user
export function assignTask(taskId, data) {
  return api.patch(`/tasks/${taskId}/assignee`, data);
}

// Delete task
export function deleteTask(taskId) {
  return api.delete(`/tasks/${taskId}`);
}

// Mark task as complete
export function completeTask(taskId) {
  return api.patch(`/tasks/${taskId}/complete`);
}

// ==================== TASK ATTACHMENTS ====================

// Attach file to task
export function attachFileToTask(taskId, data) {
  return api.post(`/tasks/${taskId}/attachments`, data);
}

// Get task attachments
export function getTaskAttachments(taskId) {
  return api.get(`/tasks/${taskId}/attachments`);
}

// Remove attachment from task
export function removeFileFromTask(taskId, fileId) {
  return api.delete(`/tasks/${taskId}/attachments/${fileId}`);
}

// ==================== TASK COMMENTS ====================

// Add comment to task
export function addComment(taskId, data) {
  return api.post(`/tasks/${taskId}/comments`, data);
}

// Get comments of a task
export function getCommentsByTask(taskId) {
  return api.get(`/tasks/${taskId}/comments`);
}

// Get comments mentioning current user
export function getMyMentions() {
  return api.get("/comments/mentions/me");
}

// Get comment detail
export function getComment(commentId) {
  return api.get(`/comments/${commentId}`);
}

// Update comment
export function updateComment(commentId, data) {
  return api.patch(`/comments/${commentId}`, data);
}

// Delete comment
export function deleteComment(commentId) {
  return api.delete(`/comments/${commentId}`);
}
