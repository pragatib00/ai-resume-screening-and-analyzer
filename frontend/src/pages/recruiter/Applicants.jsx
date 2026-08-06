import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { getApplicants, updateApplicationStatus } from "../../services/applicationService";
import { getJob } from "../../services/jobService";

const STATUSES = ["Pending", "Shortlisted", "Rejected"];

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = () => {
    Promise.all([getJob(jobId), getApplicants(jobId)])
      .then(([jobRes, applicantsRes]) => {
        setJob(jobRes.data);
        setApplicants(applicantsRes.data);
      })
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load applicants.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [jobId, toast]);

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
      toast.success(`Status updated to "${status}".`);
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
          onClick={() => navigate("/recruiter/jobs")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </button>

        {job && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
            <p className="text-sm text-slate-500">
              {job.company} · {job.location}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : applicants.length === 0 ? (
          <Card>
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="Candidates who apply to this job will show up here, ranked by match score."
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
      />
    </DashboardLayout>
  );
}

export default Applicants;
