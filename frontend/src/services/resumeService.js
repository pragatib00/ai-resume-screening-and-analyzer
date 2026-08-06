import api from "./api";

export const analyzeResume = (file, jobDescription) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  return api.post("/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
