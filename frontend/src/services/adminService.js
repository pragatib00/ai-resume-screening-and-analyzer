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

export const getResumeAnalyses = (limit = 10) =>
  api.get(`/admin/resume-analyses?limit=${limit}`);

export const getLogs = (limit = 50) => api.get(`/admin/logs?limit=${limit}`);

export const getPlatformStats = () => api.get("/admin/stats");

export const getContactMessages = () => api.get("/admin/messages");

export const getUnreadMessageCount = () => api.get("/admin/messages/unread-count");

export const markMessageRead = (messageId) =>
  api.patch(`/admin/messages/${messageId}/read`);
