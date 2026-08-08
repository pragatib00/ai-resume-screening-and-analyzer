import { useEffect, useState } from "react";
import { ScanSearch } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { getResumeAnalyses } from "../../services/adminService";

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function ResumeAnalyses() {
  const toast = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumeAnalyses(200)
      .then((res) => setAnalyses(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load resume analyses.")
      )
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <DashboardLayout navItems={adminNav} title="Resume Analyses">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : analyses.length === 0 ? (
          <Card>
            <EmptyState
              icon={ScanSearch}
              title="No analyses yet"
              description="Analyses candidates run will show up here."
            />
          </Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="px-6 py-3.5 font-medium">Candidate</th>
                    <th className="px-6 py-3.5 font-medium">Email</th>
                    <th className="px-6 py-3.5 font-medium">Score</th>
                    <th className="px-6 py-3.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analyses.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-slate-800">
                        {a.candidate?.name || "Unknown candidate"}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {a.candidate?.email || " "}
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge
                          tone={a.ats_score >= 75 ? "green" : a.ats_score >= 50 ? "amber" : "red"}
                        >
                          {Math.round(a.ats_score)}%
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{formatDate(a.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ResumeAnalyses;
