import api from "@/api/axios";

export function getMyInfo() {
  return api.get("/users/me");
}

export function editMyInfo(data) {
  return api.put("/users/me", data);
}

export function editMyAvatar(data) {
  return api.put("/users/myavatar", data);
}

export function deleteAccount() {
  return api.delete("/users/myaccount");
}

export function getUserInfo(userId) {
  return api.get(`/users/${userId}`);
}
