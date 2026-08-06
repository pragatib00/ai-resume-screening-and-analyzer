import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, roleHome } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || "/"} replace />;
  }

  return children;
}

export default ProtectedRoute;
