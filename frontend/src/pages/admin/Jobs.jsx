import { useEffect, useMemo, useState } from "react";
import { Briefcase, Trash2, MapPin, Search, Eye } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import JobDetailsModal from "../../components/common/JobDetailsModal";
import { useToast } from "../../context/ToastContext";
import { getAllJobs, deleteAnyJob } from "../../services/adminService";

function Jobs() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewedJob, setViewedJob] = useState(null);
  const [query, setQuery] = useState("");

  const load = () => {
    getAllJobs()
      .then((res) => setJobs(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load jobs.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;

    return jobs.filter((job) =>
      [job.title, job.company, job.location, job.required_skills]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [jobs, query]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAnyJob(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" was removed from the platform.`);
      setDeleteTarget(null);
      setViewedJob((prev) => (prev?.id === deleteTarget.id ? null : prev));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete job.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout navItems={adminNav} title="Job Oversight">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <EmptyState icon={Briefcase} title="No jobs posted on the platform yet" />
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="relative max-w-sm w-full">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  className="pl-10"
                  placeholder="Search by title, company, location or skill"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Badge tone="slate" className="shrink-0 self-start sm:self-auto">
                {filteredJobs.length} of {jobs.length} jobs
              </Badge>
            </div>

            {filteredJobs.length === 0 ? (
              <Card>
                <EmptyState icon={Search} title="No jobs match your search" />
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => {
                  const skills = (job.required_skills || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                  return (
                    <Card
                      key={job.id}
                      hoverable
                      className="flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                      onClick={() => setViewedJob(job)}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span>{job.company}</span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} /> {job.location}
                          </span>
                        </div>
                        {skills.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} tone="blue">
                                {skill}
                              </Badge>
                            ))}
                            {skills.length > 5 && (
                              <Badge tone="slate">+{skills.length - 5} more</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-2 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Eye}
                          onClick={() => setViewedJob(job)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={Trash2}
                          onClick={() => setDeleteTarget(job)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <JobDetailsModal
        job={viewedJob}
        open={!!viewedJob}
        onClose={() => setViewedJob(null)}
        footer={
          viewedJob && (
            <Button
              variant="danger"
              icon={Trash2}
              className="w-full"
              onClick={() => setDeleteTarget(viewedJob)}
            >
              Remove Job
            </Button>
          )
        }
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove this job?"
        message={
          deleteTarget &&
          `"${deleteTarget.title}" will be permanently removed from the platform.`
        }
        confirmLabel="Remove Job"
      />
    </DashboardLayout>
  );
}

export default Jobs;
