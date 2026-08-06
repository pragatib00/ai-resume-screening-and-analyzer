import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Building2,
  FileStack,
  Target,
  ScanSearch,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { getPlatformStats, getAnalytics } from "../../services/adminService";

function Dashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPlatformStats(), getAnalytics()])
      .then(([statsRes, analyticsRes]) => {
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load platform overview.")
      )
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <DashboardLayout navItems={adminNav} title="Admin Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="text-2xl font-bold">Platform Overview</h2>
            <p className="mt-1.5 text-blue-100">
              Monitor users, jobs and resume-screening activity across ResumeIQ.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <StatCard icon={Users} label="Candidates" value={stats.total_candidates} tone="blue" />
              <StatCard
                icon={Building2}
                label="Recruiters"
                value={stats.total_recruiters}
                tone="purple"
              />
              <StatCard icon={Briefcase} label="Jobs Posted" value={stats.total_jobs} tone="amber" />
              <StatCard
                icon={FileStack}
                label="Applications"
                value={stats.total_applications}
                tone="green"
              />
              <StatCard
                icon={Target}
                label="Avg. Match Score"
                value={`${stats.average_match_score}%`}
                tone="red"
              />
              <StatCard
                icon={ScanSearch}
                label="Resume Analyses Run"
                value={analytics.total_analyses}
                tone="blue"
              />
            </div>

            <Card>
              <h3 className="font-semibold text-slate-900 mb-1">
                Top Missing Skills Across Analyses
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                The skills candidates most often lack compared to job requirements.
              </p>

              {analytics.top_missing_skills.length === 0 ? (
                <EmptyState
                  icon={ScanSearch}
                  title="No data yet"
                  description="This chart fills in once candidates start running resume analyses."
                />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.top_missing_skills}
                      layout="vertical"
                      margin={{ left: 12, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                      <XAxis type="number" allowDecimals={false} stroke="#94A3B8" fontSize={12} />
                      <YAxis
                        type="category"
                        dataKey="skill"
                        width={110}
                        stroke="#94A3B8"
                        fontSize={12}
                      />
                      <Tooltip
                        cursor={{ fill: "#F1F5F9" }}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                      />
                      <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
