import { useEffect, useMemo, useState } from "react";
import { Search, Briefcase } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { candidateNav } from "../../layouts/navConfig";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import JobCard from "../../components/candidate/JobCard";
import ApplyModal from "../../components/candidate/ApplyModal";
import JobDetailsModal from "../../components/common/JobDetailsModal";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { getJobs } from "../../services/jobService";
import { getMyApplications } from "../../services/applicationService";

function BrowseJobs() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewedJob, setViewedJob] = useState(null);

  const loadData = () => {
    Promise.all([getJobs(), getMyApplications()])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data);
        setAppliedJobIds(new Set(appsRes.data.map((a) => a.job.id)));
      })
      .catch((err) => toast.error(err.response?.data?.detail || "Failed to load jobs."))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [toast]);

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

  return (
    <DashboardLayout navItems={candidateNav} title="Browse Jobs">
      <div className="max-w-6xl mx-auto">
        <div className="relative max-w-md mb-6">
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

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size={28} />
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description="Try a different search term, or check back later for new openings."
          />
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applied={appliedJobIds.has(job.id)}
                onApply={setSelectedJob}
                onView={setViewedJob}
              />
            ))}
          </div>
        )}
      </div>

      <JobDetailsModal
        job={viewedJob}
        open={!!viewedJob}
        onClose={() => setViewedJob(null)}
        footer={
          viewedJob &&
          (appliedJobIds.has(viewedJob.id) ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium py-2.5">
              Already Applied
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setSelectedJob(viewedJob);
                setViewedJob(null);
              }}
            >
              Apply Now
            </Button>
          ))
        }
      />

      <ApplyModal
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onApplied={loadData}
      />
    </DashboardLayout>
  );
}

export default BrowseJobs;
