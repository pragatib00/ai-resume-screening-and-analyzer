import { useEffect, useState } from "react";
import { Briefcase, Trash2, MapPin } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { adminNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../context/ToastContext";
import { getAllJobs, deleteAnyJob } from "../../services/adminService";

function Jobs() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    getAllJobs()
      .then((res) => setJobs(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load jobs.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAnyJob(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" was removed from the platform.`);
      setDeleteTarget(null);
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
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                hoverable
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>{job.company}</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {job.location}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="danger"
                  icon={Trash2}
                  onClick={() => setDeleteTarget(job)}
                  className="shrink-0"
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

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
