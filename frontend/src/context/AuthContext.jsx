/* eslint-disable react-refresh/only-export-components -- provider + useAuth hook are intentionally co-located */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

const roleHome = {
  candidate: "/candidate/dashboard",
  recruiter: "/recruiter/dashboard",
  admin: "/admin/dashboard",
};

export function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    authService
      .getCurrentUser()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.error("Your session has expired. Please log in again.");
      })
      .finally(() => setLoading(false));
  }, [toast]);

  const login = useCallback(async (email, password) => {
    const tokenRes = await authService.login(email, password);
    const token = tokenRes.data.access_token;
    localStorage.setItem("token", token);

    const userRes = await authService.getCurrentUser();
    localStorage.setItem("user", JSON.stringify(userRes.data));
    setUser(userRes.data);

    return userRes.data;
  }, []);

  const register = useCallback((data) => authService.register(data), []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, roleHome }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
