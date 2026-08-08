import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Users, ExternalLink, Sparkles } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { recruiterNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import AnalysisModal from "../../components/recruiter/AnalysisModal";
import { useToast } from "../../context/ToastContext";
import { fileUrl } from "../../services/api";
import { getRecruiterApplicants, updateApplicationStatus } from "../../services/applicationService";

const STATUSES = ["Pending", "Shortlisted", "Rejected"];

function AllApplicants() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = () => {
    getRecruiterApplicants(status)
      .then((res) => setApplicants(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load applicants.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [status, toast]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplicants((prev) =>
        status
          ? prev.filter((a) => a.id !== applicationId)
          : prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );
      toast.success(`Status updated to "${newStatus}".`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout navItems={recruiterNav} title="Applicants">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/recruiter/dashboard")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {status ? `${status} Applicants` : "All Applicants"}
          </h2>

          <Select
            value={status}
            onChange={(e) =>
              setSearchParams(e.target.value ? { status: e.target.value } : {})
            }
            className="!w-44"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : applicants.length === 0 ? (
          <Card>
            <EmptyState
              icon={Users}
              title="No applicants found"
              description={
                status
                  ? `No applicants with status "${status}" yet.`
                  : "Candidates who apply to your jobs will show up here."
              }
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <Card
                key={app.id}
                hoverable
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{app.candidate.name}</p>
                  <p className="text-sm text-slate-500">{app.candidate.email}</p>
                  <Link
                    to={`/recruiter/jobs/${app.job.id}/applicants`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {app.job.title} · {app.job.company}
                  </Link>
                </div>

                <div className="text-center shrink-0 w-20">
                  <p className="text-xl font-bold text-slate-900">
                    {Math.round(app.match_score)}%
                  </p>
                  <p className="text-xs text-slate-400">Match</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.resume_path && (
                    <a
                      href={fileUrl(app.resume_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      Resume <ExternalLink size={13} />
                    </a>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    icon={Sparkles}
                    onClick={() => setSelected(app)}
                    disabled={!app.resume_path}
                  >
                    Analysis
                  </Button>

                  <Select
                    value={app.status}
                    disabled={updatingId === app.id}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="!py-1.5 !w-36"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AnalysisModal
        key={selected?.id}
        applicant={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onAnalyzed={(applicationId, atsScore) =>
          setApplicants((prev) =>
            prev.map((a) => (a.id === applicationId ? { ...a, match_score: atsScore } : a))
          )
        }
      />
    </DashboardLayout>
  );
}

export default AllApplicants;
