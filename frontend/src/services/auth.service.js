import api from "@/api/axios";

export function login(data) {
  return api.post("/auth/login", data);
}

export function register(data) {
  return api.post("/auth/register", data);
}

export function refreshToken(data) {
  return api.post("/auth/refresh-token", data);
}
