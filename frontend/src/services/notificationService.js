import api from "./api";

export const getUnreadNotificationCount = () => api.get("/notifications/unread-count");

export const getNotifications = (limit = 10) => api.get(`/notifications/?limit=${limit}`);

export const markNotificationRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/read`);
