import api from "@/api/axios";

export const uploadFile = (formData) =>
  api.post("/files/upload", formData);

export const getFile = (fileId) =>
  api.get(`/files/${fileId}`);

export const downloadFile = (fileId) =>
  api.get(`/files/${fileId}/download`, {
    responseType: "blob",
  });
