import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { recruiterNav } from "../../layouts/navConfig";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../context/ToastContext";
import { createJob, getJob, updateJob } from "../../services/jobService";

const EMPTY_FORM = {
  title: "",
  company: "",
  description: "",
  required_skills: "",
  location: "",
};

function JobForm() {
  const { jobId } = useParams();
  const isEdit = Boolean(jobId);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    getJob(jobId)
      .then((res) => {
        const { title, company, description, required_skills, location } = res.data;
        setForm({ title, company, description, required_skills, location });
      })
      .catch(() => {
        setError("Failed to load this job.");
        toast.error("Failed to load this job.");
      })
      .finally(() => setLoading(false));
  }, [jobId, isEdit, toast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (isEdit) {
        await updateJob(jobId, form);
        toast.success("Job updated successfully.");
      } else {
        await createJob(form);
        toast.success("Job posted successfully.");
      }
      navigate("/recruiter/jobs");
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to save job.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      navItems={recruiterNav}
      title={isEdit ? "Edit Job" : "Post a Job"}
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size={28} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}

              <Input
                label="Job Title"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Backend Engineer"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Company"
                  name="company"
                  required
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Inc."
                />

                <Input
                  label="Location"
                  name="location"
                  required
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote / Kathmandu"
                />
              </div>

              <Textarea
                label="Job Description"
                name="description"
                required
                rows={7}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities and requirements..."
              />

              <Input
                label="Required Skills"
                name="required_skills"
                required
                value={form.required_skills}
                onChange={handleChange}
                placeholder="Comma-separated, e.g. Python, FastAPI, SQL"
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={saving}>
                  {isEdit ? "Save Changes" : "Post Job"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/recruiter/jobs")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default JobForm;
