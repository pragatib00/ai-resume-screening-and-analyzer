import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileStack, Target, TrendingUp, Search, ScanSearch } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { candidateNav } from "../../layouts/navConfig";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { getMyApplications } from "../../services/applicationService";

function CandidateDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load your dashboard.")
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const totalApplications = applications.length;
  const scored = applications.filter((a) => a.match_score > 0);
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, a) => sum + a.match_score, 0) / scored.length)
    : 0;
  const bestScore = scored.length
    ? Math.round(Math.max(...scored.map((a) => a.match_score)))
    : 0;

  return (
    <DashboardLayout navItems={candidateNav} title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="text-2xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}
            </h2>
            <p className="mt-1.5 text-blue-100">
              Here's what's happening with your job search.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <StatCard
            icon={FileStack}
            label="Applications Sent"
            value={totalApplications}
            tone="blue"
          />
          <StatCard
            icon={Target}
            label="Average Match Score"
            value={`${avgScore}%`}
            tone="amber"
          />
          <StatCard
            icon={TrendingUp}
            label="Best Match Score"
            value={`${bestScore}%`}
            tone="green"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Recent Applications</h3>
              <Link
                to="/candidate/applications"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={FileStack}
                title="No applications yet"
                description="Browse open roles and apply to get started."
                action={
                  <Link to="/candidate/jobs">
                    <Button icon={Search}>Browse Jobs</Button>
                  </Link>
                }
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-3.5 px-3 -mx-3 rounded-xl hover:bg-slate-50 transition"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {app.job.title}
                      </p>
                      <p className="text-xs text-slate-500">{app.job.company}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-slate-700">
                        {Math.round(app.match_score)}%
                      </span>
                      <Badge>{app.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-3">
            <h3 className="font-semibold text-slate-900 mb-1">Quick Actions</h3>

            <Link to="/candidate/jobs">
              <Button variant="secondary" icon={Search} className="w-full justify-start">
                Browse open jobs
              </Button>
            </Link>

            <Link to="/candidate/resume-analyzer">
              <Button
                variant="secondary"
                icon={ScanSearch}
                className="w-full justify-start"
              >
                Analyze your resume
              </Button>
            </Link>

            <Link to="/candidate/applications">
              <Button
                variant="secondary"
                icon={FileStack}
                className="w-full justify-start"
              >
                Track applications
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CandidateDashboard;
