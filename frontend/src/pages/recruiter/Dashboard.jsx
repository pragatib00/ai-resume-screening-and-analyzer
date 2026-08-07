import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileStack,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  PlusCircle,
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import { recruiterNav } from "../../layouts/navConfig";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getRecruiterAnalytics } from "../../services/applicationService";

const STATUS_COLORS = {
  Shortlisted: "#10B981",
  Pending: "#F59E0B",
  Rejected: "#EF4444",
};

const COLORS = {
  blue: "#2563EB",
  orange: "#F97316",
};

function truncateLabel(label, max = 14) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function RecruiterDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
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
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <StatCard
                icon={Briefcase}
                label="Jobs Posted"
                value={stats.jobs_posted}
                tone="blue"
                onClick={() => navigate("/recruiter/jobs")}
              />
              <StatCard
                icon={FileStack}
                label="Total Applications"
                value={stats.applications}
                tone="purple"
                onClick={() => navigate("/recruiter/applicants")}
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
                onClick={() => navigate("/recruiter/applicants?status=Shortlisted")}
              />
              <StatCard
                icon={Clock}
                label="Pending Review"
                value={stats.pending}
                tone="amber"
                onClick={() => navigate("/recruiter/applicants?status=Pending")}
              />
              <StatCard
                icon={XCircle}
                label="Rejected"
                value={stats.rejected}
                tone="red"
                onClick={() => navigate("/recruiter/applicants?status=Rejected")}
              />
            </div>

            <div className="grid lg:grid-cols-5 gap-5">
              <Card className="lg:col-span-2">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Application Pipeline
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  How your applicants are distributed across review stages.
                </p>

                {stats.applications === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No applicants yet"
                    description="This chart fills in once candidates apply to your jobs."
                  />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Shortlisted", value: stats.shortlisted },
                            { name: "Pending", value: stats.pending },
                            { name: "Rejected", value: stats.rejected },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          cornerRadius={6}
                        >
                          {["Shortlisted", "Pending", "Rejected"].map((status) => (
                            <Cell key={status} fill={STATUS_COLORS[status]} />
                          ))}
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
                  Applications per Job
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Which of your postings are attracting the most candidates.
                </p>

                {!stats.by_job || stats.by_job.length === 0 ? (
                  <EmptyState
                    icon={Briefcase}
                    title="No jobs posted yet"
                    description="Post a job to start tracking applications."
                  />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.by_job.slice(0, 8).map((j) => ({
                          ...j,
                          label: truncateLabel(j.title),
                        }))}
                        margin={{ top: 16, left: 0, right: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                        <YAxis allowDecimals={false} stroke="#94A3B8" fontSize={12} />
                        <Tooltip
                          cursor={{ fill: "#F1F5F9" }}
                          contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                          labelFormatter={(_, payload) => payload?.[0]?.payload?.title}
                        />
                        <Bar
                          dataKey="applications"
                          fill={COLORS.blue}
                          radius={[6, 6, 0, 0]}
                          maxBarSize={48}
                        >
                          <LabelList dataKey="applications" position="top" fill="#475569" fontSize={12} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold text-slate-900 mb-1">
                Job Performance: Average Match Score
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                How well applicants match each job's requirements, on average.
              </p>

              {!stats.by_job || stats.by_job.filter((j) => j.applications > 0).length === 0 ? (
                <EmptyState
                  icon={Target}
                  title="No scored applications yet"
                  description="This chart fills in once candidates apply and their resumes are scored."
                />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.by_job
                        .filter((j) => j.applications > 0)
                        .slice(0, 8)
                        .map((j) => ({ ...j, label: truncateLabel(j.title) }))}
                      margin={{ top: 16, left: 0, right: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                      <YAxis
                        allowDecimals={false}
                        stroke="#94A3B8"
                        fontSize={12}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        cursor={{ fill: "#F1F5F9" }}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.title}
                        formatter={(value) => [`${value}%`, "Avg. Match Score"]}
                      />
                      <Bar
                        dataKey="average_score"
                        fill={COLORS.orange}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                      >
                        <LabelList
                          dataKey="average_score"
                          position="top"
                          fill="#475569"
                          fontSize={12}
                          formatter={(v) => `${v}%`}
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

export default RecruiterDashboard;
