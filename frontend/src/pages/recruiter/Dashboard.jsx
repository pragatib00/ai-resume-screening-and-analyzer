import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  FileStack,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  PlusCircle,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { recruiterNav } from "../../layouts/navConfig";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getRecruiterAnalytics } from "../../services/applicationService";

function RecruiterDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecruiterAnalytics()
      .then((res) => setStats(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load your dashboard.")
      )
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <DashboardLayout navItems={recruiterNav} title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="text-2xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}
            </h2>
            <p className="mt-1.5 text-blue-100">
              Here's how your job postings are performing.
            </p>
          </div>

          <Link to="/recruiter/jobs/new" className="relative shrink-0">
            <Button
              variant="secondary"
              icon={PlusCircle}
              className="!bg-white !text-blue-600 !font-semibold border-0 hover:!bg-blue-50 shadow-lg shadow-blue-900/20"
            >
              Post a Job
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <StatCard icon={Briefcase} label="Jobs Posted" value={stats.jobs_posted} tone="blue" />
            <StatCard
              icon={FileStack}
              label="Total Applications"
              value={stats.applications}
              tone="purple"
            />
            <StatCard
              icon={Target}
              label="Average Match Score"
              value={`${stats.average_score}%`}
              tone="amber"
            />
            <StatCard
              icon={CheckCircle2}
              label="Shortlisted"
              value={stats.shortlisted}
              tone="green"
            />
            <StatCard icon={Clock} label="Pending Review" value={stats.pending} tone="amber" />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejected} tone="red" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RecruiterDashboard;
