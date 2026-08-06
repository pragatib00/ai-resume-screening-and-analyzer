import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileStack, MapPin, Building2, UploadCloud, Search } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { candidateNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { getMyApplications, uploadResume } from "../../services/applicationService";

function ScoreBar({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="w-32">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">Match</span>
        <span className="font-semibold text-slate-700">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MyApplications() {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  const load = () => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load applications.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const handleUpload = async (applicationId, file) => {
    if (!file) return;
    setUploadingId(applicationId);
    try {
      await uploadResume(applicationId, file);
      load();
      toast.success("Resume uploaded and scored.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to upload resume.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <DashboardLayout navItems={candidateNav} title="My Applications">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileStack}
              title="No applications yet"
              description="Once you apply to a job, you'll be able to track its status and match score here."
              action={
                <Link to="/candidate/jobs">
                  <Button icon={Search}>Browse Jobs</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app.id}
                hoverable
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{app.job.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={14} /> {app.job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {app.job.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  {app.resume_path ? (
                    <ScoreBar score={app.match_score} />
                  ) : (
                    <label className="inline-flex items-center gap-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 text-sm font-medium cursor-pointer transition">
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleUpload(app.id, e.target.files[0])}
                      />
                      {uploadingId === app.id ? (
                        <Spinner size={14} />
                      ) : (
                        <UploadCloud size={14} />
                      )}
                      Upload Resume
                    </label>
                  )}

                  <Badge>{app.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyApplications;
