import api from "./api";

export const getUsers = () => api.get("/admin/users");

export const updateUserRole = (userId, role) =>
  api.patch(`/admin/users/${userId}/role`, { role });

export const updateUserStatus = (userId, status) =>
  api.patch(`/admin/users/${userId}/status`, { status });

export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

export const getAllJobs = () => api.get("/admin/jobs");

export const deleteAnyJob = (jobId) => api.delete(`/admin/jobs/${jobId}`);

export const getAnalytics = () => api.get("/admin/analytics");

export const getLogs = (limit = 50) => api.get(`/admin/logs?limit=${limit}`);

export const getPlatformStats = () => api.get("/admin/stats");
