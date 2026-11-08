import api from "@/api/axios";

export function getNotifications() {
  return api.get("/notifications");
}

export function getNotification(notifyId) {
  return api.get(`/notifications/${notifyId}`);
}

export function markAsRead(notifyId) {
  return api.patch(`/notifications/${notifyId}/read`);
}

export function markAllAsRead() {
  return api.patch("/notifications/read");
}

export function deleteNotification(notifyId) {
  return api.delete(`/notifications/${notifyId}`);
}
