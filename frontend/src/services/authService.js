import api from "./api";

export const register = (data) => {
  return api.post("/users/register", data);
};

export const login = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email); // FastAPI expects username
  formData.append("password", password);

  return api.post("/users/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const getCurrentUser = () => {
  return api.get("/users/me");
};