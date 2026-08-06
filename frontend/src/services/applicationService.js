import api from "./api";

export const applyToJob = (jobId) => api.post("/applications/", { job_id: jobId });

export const uploadResume = (applicationId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/applications/${applicationId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getMyApplications = () => api.get("/applications/my");

export const getApplicants = (jobId) => api.get(`/applications/job/${jobId}`);

export const getApplicantAnalysis = (applicationId) =>
  api.get(`/applications/${applicationId}/analysis`);

export const updateApplicationStatus = (applicationId, status) =>
  api.put(`/applications/${applicationId}/status`, { status });

export const getRecruiterAnalytics = () => api.get("/applications/analytics");
