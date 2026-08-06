import api from "./api";

export const getJobs = () => api.get("/jobs/");

export const getMyJobs = () => api.get("/jobs/my");

export const getJob = (jobId) => api.get(`/jobs/${jobId}`);

export const createJob = (data) => api.post("/jobs/", data);

export const updateJob = (jobId, data) => api.put(`/jobs/${jobId}`, data);

export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);
