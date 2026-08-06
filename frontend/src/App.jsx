import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CandidateDashboard from "./pages/candidate/Dashboard";
import BrowseJobs from "./pages/candidate/BrowseJobs";
import MyApplications from "./pages/candidate/MyApplications";
import ResumeAnalyzer from "./pages/candidate/ResumeAnalyzer";

import RecruiterDashboard from "./pages/recruiter/Dashboard";
import MyJobs from "./pages/recruiter/MyJobs";
import JobForm from "./pages/recruiter/JobForm";
import Applicants from "./pages/recruiter/Applicants";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";
import AdminLogs from "./pages/admin/Logs";

function App() {
  return (
    <ToastProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/jobs"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <BrowseJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/applications"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/resume-analyzer"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/edit"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLogs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
