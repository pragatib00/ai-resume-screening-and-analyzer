import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, PlusCircle, Pencil, Trash2, Users } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { recruiterNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../context/ToastContext";
import { getMyJobs, deleteJob } from "../../services/jobService";

function MyJobs() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    getMyJobs()
      .then((res) => setJobs(res.data))
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to load your jobs.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteJob(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" was deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete job.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout navItems={recruiterNav} title="My Jobs">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-6">
          <Link to="/recruiter/jobs/new">
            <Button icon={PlusCircle}>Post a Job</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet"
              description="Post your first job listing to start receiving applications."
              action={
                <Link to="/recruiter/jobs/new">
                  <Button icon={PlusCircle}>Post a Job</Button>
                </Link>
              }
            />
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

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                    <Button size="sm" variant="outline" icon={Users}>
                      Applicants
                    </Button>
                  </Link>

                  <Link to={`/recruiter/jobs/${job.id}/edit`}>
                    <Button size="sm" variant="secondary" icon={Pencil}>
                      Edit
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                    onClick={() => setDeleteTarget(job)}
                  >
                    Delete
                  </Button>
                </div>
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
        title="Delete this job?"
        message={
          deleteTarget &&
          `"${deleteTarget.title}" and all of its applications will be permanently removed. This cannot be undone.`
        }
        confirmLabel="Delete Job"
      />
    </DashboardLayout>
  );
}

export default MyJobs;
