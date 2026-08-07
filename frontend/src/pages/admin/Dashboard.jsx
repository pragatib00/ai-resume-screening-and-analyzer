import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Building2,
  FileStack,
  Target,
  ScanSearch,
  ShieldCheck,
  ScrollText,
  ArrowRight,
  Gauge,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { getPlatformStats, getAnalytics } from "../../services/adminService";

const QUICK_LINKS = [
  {
    to: "/admin/users",
    label: "Manage Users",
    description: "Approve, suspend or change roles",
    icon: Users,
    tone: "blue",
  },
  {
    to: "/admin/jobs",
    label: "Job Oversight",
    description: "Review and moderate job postings",
    icon: ShieldCheck,
    tone: "amber",
  },
  {
    to: "/admin/logs",
    label: "Error Logs",
    description: "Investigate recent system errors",
    icon: ScrollText,
    tone: "red",
  },
];

const COLORS = {
  blue: "#2563EB",
  orange: "#F97316",
  violet: "#7C3AED",
};

function Dashboard() {
  const toast = useToast();
  const navigate = useNavigate();
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
              <StatCard
                icon={Users}
                label="Candidates"
                value={stats.total_candidates}
                tone="blue"
                onClick={() => navigate("/admin/users")}
              />
              <StatCard
                icon={Building2}
                label="Recruiters"
                value={stats.total_recruiters}
                tone="purple"
                onClick={() => navigate("/admin/users")}
              />
              <StatCard
                icon={Briefcase}
                label="Jobs Posted"
                value={stats.total_jobs}
                tone="amber"
                onClick={() => navigate("/admin/jobs")}
              />
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
              <StatCard
                icon={Gauge}
                label="Avg. ATS Score"
                value={`${analytics.average_ats_score}%`}
                tone="purple"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {QUICK_LINKS.map(({ to, label, description, icon: Icon, tone }) => {
                const tones = {
                  blue: "bg-blue-50 text-blue-600",
                  amber: "bg-amber-50 text-amber-600",
                  red: "bg-red-50 text-red-600",
                };

                return (
                  <Card
                    key={to}
                    hoverable
                    className="cursor-pointer group"
                    onClick={() => navigate(to)}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}
                    >
                      <Icon size={18} />
                    </div>
                    <h4 className="mt-3.5 font-semibold text-slate-900 flex items-center gap-1.5">
                      {label}
                      <ArrowRight
                        size={14}
                        className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
                      />
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                  </Card>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-5 gap-5">
              <Card className="lg:col-span-2">
                <h3 className="font-semibold text-slate-900 mb-1">
                  User Distribution
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Candidates vs. recruiters on the platform.
                </p>

                {stats.total_candidates + stats.total_recruiters === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No users yet"
                    description="This chart fills in once people start signing up."
                  />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Candidates", value: stats.total_candidates },
                            { name: "Recruiters", value: stats.total_recruiters },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          cornerRadius={6}
                        >
                          <Cell fill={COLORS.blue} />
                          <Cell fill={COLORS.orange} />
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={32}
                          formatter={(value) => (
                            <span className="text-xs text-slate-600">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>

              <Card className="lg:col-span-3">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Platform Activity
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Jobs posted, applications received and analyses run.
                </p>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { label: "Jobs Posted", value: stats.total_jobs },
                        { label: "Applications", value: stats.total_applications },
                        { label: "Analyses Run", value: analytics.total_analyses },
                      ]}
                      margin={{ top: 16, left: 0, right: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                      <YAxis allowDecimals={false} stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        cursor={{ fill: "#F1F5F9" }}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                      />
                      <Bar dataKey="value" fill={COLORS.blue} radius={[6, 6, 0, 0]} maxBarSize={64}>
                        <LabelList dataKey="value" position="top" fill="#475569" fontSize={12} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
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
                      margin={{ top: 16, left: 0, right: 12, bottom: 32 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="skill"
                        stroke="#94A3B8"
                        fontSize={12}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis allowDecimals={false} stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        cursor={{ fill: "#F1F5F9" }}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                      />
                      <Bar
                        dataKey="count"
                        fill={COLORS.blue}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                      >
                        <LabelList
                          dataKey="count"
                          position="top"
                          fill="#475569"
                          fontSize={12}
                        />
                      </Bar>
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
